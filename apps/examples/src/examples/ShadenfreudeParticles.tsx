import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  assignment,
  AttributeNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  DivideNode,
  Factory,
  float,
  IShaderNode,
  MultiplyNode,
  ShaderNode,
  SubtractNode,
  TimeNode,
  vec2,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { Emitter, Particles } from "three-vfx"

const useShader = (fac: () => IShaderNode) => {
  const [shader, update] = useMemo(() => compileShader(fac()), [])
  useFrame((_, dt) => update(dt))
  return shader
}

const SplitVector2Node = Factory(() =>
  ShaderNode({
    name: "Split Vector2",
    inputs: {
      a: vec2()
    },
    outputs: {
      value: vec2("inputs.a"),
      x: float("inputs.a.x"),
      y: float("inputs.a.y")
    }
  })
)

const StatelessVelocityNode = Factory(() =>
  ShaderNode({
    name: "Velocity",
    inputs: {
      velocity: vec3(),
      time: float(TimeNode())
    },
    outputs: {
      value: vec3()
    },
    vertex: {
      body: assignment(
        "outputs.value",
        "inputs.time * inputs.velocity * mat3(instanceMatrix)"
      )
    }
  })
)

const StatelessAccelerationNode = Factory(() =>
  ShaderNode({
    name: "Acceleration",
    inputs: {
      acceleration: vec3(),
      time: float(TimeNode())
    },
    outputs: {
      value: vec3()
    },
    vertex: {
      body: assignment(
        "outputs.value",
        "0.5 * inputs.time * inputs.time * inputs.acceleration * mat3(instanceMatrix)"
      )
    }
  })
)

const StatelessAlphaAnimationNode = Factory(() =>
  ShaderNode({
    name: "Stateless Alpha Animation",
    inputs: {
      min: float(),
      max: float(),
      t: float()
    },
    outputs: {
      value: float("mix(inputs.min, inputs.max, inputs.t)")
    }
  })
)

const HideDeadParticles = Factory(() =>
  ShaderNode({
    name: "Hide Dead Particles",
    inputs: {
      progress: float()
    },
    outputs: {
      value: float(1)
    },
    fragment: {
      body: `if (inputs.progress > 1.0 || inputs.progress < 0.0) discard;`
    }
  })
)

export default function ShadenfreudeParticles() {
  const imesh = useRef<Particles>(null!)

  const shader = useShader(() => {
    const blackboard = {
      lifetime: AttributeNode({ name: "lifetime", type: "vec2" }),
      velocity: AttributeNode({ name: "velocity", type: "vec3" })
    }

    const lifetimeData = SplitVector2Node({
      a: blackboard.lifetime
    })

    const particleAge = SubtractNode({
      a: TimeNode(),
      b: lifetimeData.outputs.x
    })

    const particleMaxAge = SubtractNode({
      a: lifetimeData.outputs.y,
      b: lifetimeData.outputs.x
    })

    const particleProgress = DivideNode({
      a: particleAge,
      b: particleMaxAge
    })

    return CustomShaderMaterialMasterNode({
      diffuseColor: new Color("#ccc"),

      alpha: MultiplyNode({
        a: StatelessAlphaAnimationNode({ t: particleProgress, min: 1, max: 0 }),
        b: HideDeadParticles({ progress: particleProgress })
      }),

      position: AddNode({
        a: VertexPositionNode(),
        b: AddNode({
          a: StatelessVelocityNode({
            velocity: blackboard.velocity,
            time: particleAge
          }),
          b: StatelessAccelerationNode({
            acceleration: new Vector3(0, -10, 0),
            time: particleAge
          })
        })
      })
    })
  })

  return (
    <group position-y={15}>
      <Particles ref={imesh}>
        <boxGeometry />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
        />

        <Emitter count={1} continuous />
      </Particles>
    </group>
  )
}
