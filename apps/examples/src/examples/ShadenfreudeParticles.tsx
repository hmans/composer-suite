import { useFrame } from "@react-three/fiber"
import { plusMinus, upTo } from "randomish"
import { useLayoutEffect, useMemo, useRef } from "react"
import {
  AddNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  IShaderNode,
  MultiplyNode,
  ShaderNode,
  TimeNode,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, Matrix4, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { Particles } from "three-vfx"

const useShader = (fac: () => IShaderNode) => {
  const [shader, update] = useMemo(() => compileShader(fac()), [])
  useFrame((_, dt) => update(dt))
  return shader
}

const ParticleLifetime = Factory(() =>
  ShaderNode({
    name: "Particle Lifetime",
    inputs: {
      time: float(TimeNode())
    },
    outputs: {
      value: float("inputs.time") // TODO
    }
  })
)

const ParticleProgress = Factory(() =>
  ShaderNode({
    name: "Particle Progress",
    inputs: {
      age: float(ParticleLifetime())
    },
    outputs: {
      value: float("inputs.age / 10.0")
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

export default function ShadenfreudeParticles() {
  const imesh = useRef<Particles>(null!)

  const shader = useShader(() => {
    const diffuseColor = ShaderNode({
      name: "Color Stack",
      inputs: { a: vec3(new Color("#555")) },
      outputs: { value: vec3("inputs.a") },
      filters: []
    })

    const particleLifetime = ParticleLifetime()

    const position = ShaderNode({
      name: "Position Stack",
      inputs: { a: vec3(VertexPositionNode()) },
      outputs: { value: vec3("inputs.a") },
      filters: [
        AddNode({
          b: StatelessVelocityNode({
            velocity: new Vector3(plusMinus(10), 5 + upTo(5), plusMinus(10)),
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
      position
    })
  })

  useLayoutEffect(() => {
    /* Spawn a single particle */
    imesh.current.setMatrixAt(0, new Matrix4())
    imesh.current.count = 1
  }, [])

  return (
    <group position-y={15}>
      <Particles ref={imesh}>
        <sphereGeometry />
        <CustomShaderMaterial baseMaterial={MeshStandardMaterial} {...shader} />
      </Particles>
    </group>
  )
}
