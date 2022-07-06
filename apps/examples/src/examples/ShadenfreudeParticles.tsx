import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  add,
  AttributeNode,
  bool,
  compileShader,
  CustomShaderMaterialMasterNode,
  divide,
  Factory,
  float,
  IShaderNode,
  join,
  mix,
  multiply,
  Parameter,
  ShaderNode,
  sin,
  split,
  subtract,
  TimeNode,
  varying,
  Vector3Node,
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
      body: `if (inputs.progress > 1.0 || inputs.progress < 0.0) { outputs.value = 0.0; discard; }`
    }
  })
)

export default function ShadenfreudeParticles() {
  const imesh = useRef<Particles>(null!)

  const shader = useShader(() => {
    const blackboard = {
      time: TimeNode(),
      lifetime: AttributeNode({ name: "lifetime", type: "vec2" }),
      velocity: AttributeNode({ name: "velocity", type: "vec3" }),
      acceleration: Vector3Node({ a: new Vector3(0, -10, 0) })
    }

    const instanceMatrix = varying("mat3", "mat3(instanceMatrix)")

    const lifetimeData = split(blackboard.lifetime)

    const particleAge = subtract(blackboard.time, lifetimeData.outputs.x)

    const particleMaxAge = subtract(
      lifetimeData.outputs.y,
      lifetimeData.outputs.x
    )

    const particleProgress = divide(particleAge, particleMaxAge)

    /* These are (some) primitives provided by 3VFX. */
    const applyStatelessVelocity = (v: Parameter<"vec3">) =>
      multiply(v, instanceMatrix, particleAge)

    const applyStatelessAcceleration = (a: Parameter<"vec3">) =>
      multiply(a, instanceMatrix, particleAge, particleAge, 0.5)

    /* Just extract commonly used helpers into functions: */
    const wobble = (frequency: number, amplitude: number) =>
      multiply(sin(multiply(particleAge, frequency)), amplitude)

    /* This is the part that 3VFX users will get to assemble and customize. */
    const movement = [
      applyStatelessVelocity(blackboard.velocity),
      applyStatelessAcceleration(blackboard.acceleration),

      multiply(join(wobble(11, 3), wobble(7, 3), wobble(5, 3)), instanceMatrix)
    ]

    return CustomShaderMaterialMasterNode({
      diffuseColor: new Color("#ccc"),

      alpha: multiply(
        /* Always start with full opacity. */
        1,

        /* Show/shide particles based on their aliveness state */
        HideDeadParticles({ progress: particleProgress }),

        /* Animate alpha over time */
        mix(1, 0, ExponentialEaseInNode({ a: particleProgress }))
      ),

      position: add(VertexPositionNode(), ...movement)
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
