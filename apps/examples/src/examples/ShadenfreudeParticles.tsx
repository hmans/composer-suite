import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  add,
  assignment,
  AttributeNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  divide,
  DivideNode,
  Factory,
  float,
  FloatNode,
  IShaderNode,
  MixNode,
  multiply,
  MultiplyNode,
  ShaderNode,
  split,
  subtract,
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

const ExponentialEaseInNode = Factory(() =>
  ShaderNode({
    name: "Exponential Ease In",
    inputs: { a: float() },
    outputs: {
      value: float(
        "inputs.a == 0.0 ? inputs.a : pow(2.0, 10.0 * (inputs.a - 1.0))"
      )
    }
  })
)

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
      time: TimeNode(),
      lifetime: AttributeNode({ name: "lifetime", type: "vec2" }),
      velocity: AttributeNode({ name: "velocity", type: "vec3" })
    }

    const lifetimeData = split(blackboard.lifetime)

    const particleAge = subtract(blackboard.time, lifetimeData.outputs.x)

    const particleMaxAge = subtract(
      lifetimeData.outputs.y,
      lifetimeData.outputs.x
    )

    const particleProgress = divide(particleAge, particleMaxAge)

    const alphaOverTime = MixNode({
      a: FloatNode({ a: 1 }),
      b: FloatNode({ a: 0 }),
      factor: ExponentialEaseInNode({ a: particleProgress })
    })

    return CustomShaderMaterialMasterNode({
      diffuseColor: new Color("#ccc"),

      alpha: multiply(
        alphaOverTime,
        HideDeadParticles({ progress: particleProgress })
      ),

      position: add(
        VertexPositionNode(),

        StatelessVelocityNode({
          velocity: blackboard.velocity,
          time: particleAge
        }),

        StatelessAccelerationNode({
          acceleration: new Vector3(0, -10, 0),
          time: particleAge
        })
      )
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
