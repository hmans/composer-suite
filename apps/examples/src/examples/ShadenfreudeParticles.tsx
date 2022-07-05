import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  assignment,
  AttributeNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  IShaderNode,
  MultiplyNode,
  ShaderNode,
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

const ParticleAge = Factory(() =>
  ShaderNode({
    name: "Particle Lifetime",
    inputs: {
      time: float(TimeNode()),
      lifetime: vec2()
    },
    outputs: {
      value: float("inputs.time - inputs.lifetime.x")
    }
  })
)

const ParticleProgress = Factory(() =>
  ShaderNode({
    name: "Particle Progress",
    inputs: {
      age: float(),
      lifetime: vec2()
    },
    outputs: {
      value: float("inputs.age / (inputs.lifetime.y - inputs.lifetime.x)")
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
      lifetime: AttributeNode({ name: "lifetime", type: "vec2" }),
      velocity: AttributeNode({ name: "velocity", type: "vec3" })
    }

    const particleAge = ParticleAge({
      lifetime: blackboard.lifetime
    })

    const particleProgress = ParticleProgress({
      lifetime: blackboard.lifetime,
      age: particleAge
    })

    return CustomShaderMaterialMasterNode({
      diffuseColor: new Color("#ccc"),

      alpha: MultiplyNode({
        a: 1,
        b: HideDeadParticles({ progress: particleProgress })
      }),

      position: AddNode({
        a: VertexPositionNode(),
        b: AddNode({
          a: StatelessVelocityNode({
            velocity: blackboard.velocity,
            time: ParticleAge({ lifetime: blackboard.lifetime })
          }),
          b: StatelessAccelerationNode({
            acceleration: new Vector3(0, -10, 0),
            time: ParticleAge({ lifetime: blackboard.lifetime })
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
