import { useFrame } from "@react-three/fiber"
import { plusMinus, upTo } from "randomish"
import { useLayoutEffect, useMemo, useRef } from "react"
import {
  AddNode,
  AttributeNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  IShaderNode,
  ShaderNode,
  TimeNode,
  vec2,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, Matrix4, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { Emitter, Particles, Repeat } from "three-vfx"

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
      lifetime: vec2(AttributeNode({ name: "lifetime", type: "vec2" }))
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
      age: float(ParticleAge()),
      lifetime: vec2(AttributeNode({ name: "lifetime", type: "vec2" }))
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
      value: vec3("inputs.time * inputs.velocity")
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
      value: vec3("0.5 * inputs.time * inputs.time * inputs.acceleration")
    }
  })
)

const HideDeadParticles = Factory(() =>
  ShaderNode({
    name: "Hide Dead Particles",
    inputs: {
      a: float(),
      progress: float(ParticleProgress())
    },
    outputs: {
      value: float("inputs.progress > 1.0 || inputs.progress < 0.0 ? 0.0 : 1.0")
    }
  })
)

export default function ShadenfreudeParticles() {
  const imesh = useRef<Particles>(null!)

  const shader = useShader(() => {
    const particleLifetime = ParticleAge()

    const velocityAttribute = AttributeNode({ name: "velocity", type: "vec3" })

    const diffuseColor = ShaderNode({
      name: "Color Stack",
      inputs: { a: vec3(new Color("#555")) },
      outputs: { value: vec3("inputs.a") },
      filters: []
    })

    const alpha = ShaderNode({
      name: "Alpha Stack",
      inputs: { a: float(1) },
      outputs: { value: float("inputs.a") },
      filters: [HideDeadParticles()]
    })

    const position = ShaderNode({
      name: "Position Stack",
      inputs: { a: vec3(VertexPositionNode()) },
      outputs: { value: vec3("inputs.a") },
      filters: [
        AddNode({
          b: StatelessVelocityNode({
            velocity: velocityAttribute,
            time: particleLifetime
          })
        }),
        AddNode({
          b: StatelessAccelerationNode({
            acceleration: new Vector3(0, -10, 0),
            time: particleLifetime
          })
        })
      ]
    })

    return CustomShaderMaterialMasterNode({
      diffuseColor,
      alpha,
      position
    })
  })

  return (
    <group position-y={15}>
      <Particles ref={imesh}>
        <sphereGeometry />
        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
        />

        <Repeat interval={0.2}>
          <Emitter count={1} />
        </Repeat>
      </Particles>
    </group>
  )
}
