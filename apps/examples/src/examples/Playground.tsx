import { between, plusMinus, upTo } from "randomish"
import { useEffect, useRef } from "react"
import {
  $,
  Add,
  Cos,
  InstanceMatrix,
  Mix,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  Rotation3DY
} from "shader-composer"
import { Color, Vector3 } from "three"
import {
  Module,
  ParticleAge,
  ParticleAttribute,
  ParticleProgress,
  Particles,
  ScaleModule,
  VelocityModule
} from "vfx-composer"

const FirestormModule = (): Module => (input) => {
  const spawnOffset = ParticleAttribute(
    "vec3",
    () => new Vector3(plusMinus(6), 0, 0)
  )
  const speed = ParticleAttribute("float", () => between(2, 5))
  const darkness = ParticleAttribute("float", () => upTo(0.2))

  return {
    ...input,

    color: Mix(input.color, new Color("black"), darkness),

    position: Add(
      input.position,
      Mul(
        Mul(
          Mul(spawnOffset, NormalizePlusMinusOne(Cos(Mul(ParticleAge, 2)))),
          Rotation3DY(Mul(ParticleAge, speed))
        ),
        $`mat3(${InstanceMatrix})`
      )
    )
  }
}

export default function Playground() {
  const particles = useRef<Particles>(null!)

  useEffect(() => {
    const { spawn } = particles.current

    const id = setInterval(() => {
      spawn(20, {
        position: (p) => p.set(plusMinus(2), 0, plusMinus(2)),
        rotation: (q) => q.random()
      })
    }, 80)

    return () => clearInterval(id)
  }, [])

  return (
    <Particles
      ref={particles}
      position-y={2}
      modules={[
        /*
        Scale the particle. Pass a Shader Unit to steer scale over time.
        */
        ScaleModule(OneMinus(ParticleProgress)),

        /*
        Perform gravity. Gravity is the same for all particles, so we're using
        a constant Vector3 value here.
        */
        // AccelerationModule(new Vector3(0, -9.81, 0)),

        /*
        Simulate velocity. Velocity should be different for each particle, so
        we're passing a function that returns a new Vector3 for every spawned
        particle. The module will automatically set up an instanced buffer
        attribute and upload newly filled values to the GPU. ✨
        */
        VelocityModule(
          new Vector3(0, 4, 0)
          // () => new Vector3(plusMinus(3), between(5, 15), plusMinus(3))
        ),

        FirestormModule(),

        (payload) => ({ ...payload, position: Mul(payload.position, 2) })
      ]}
    >
      {/* You can assign any geometry. */}
      <boxGeometry />

      {/* And any material! */}
      <meshStandardMaterial color="white" />
    </Particles>
  )
}
