import { between, plusMinus } from "randomish"
import { useEffect, useMemo, useRef } from "react"
import {
  Add,
  Cos,
  Float,
  mat3,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Rotation3D,
  Rotation3DY,
  Smoothstep
} from "shader-composer"
import { Color, Vector3 } from "three"
import { Particles } from "vfx-composer/fiber"
import {
  Lifetime,
  Scale,
  SetColor,
  Translate,
  Velocity
} from "vfx-composer/modules"
import {
  EffectAge,
  ParticleAge,
  ParticleAttribute,
  ParticleProgress
} from "vfx-composer/units"

export default function Playground() {
  const particles = useRef<Particles>(null!)

  const variables = useMemo(
    () => ({
      velocity: ParticleAttribute("vec3", () => new Vector3()),
      offset: ParticleAttribute("vec3", () => new Vector3())
    }),
    []
  )

  useEffect(() => {
    const { spawn } = particles.current

    const id = setInterval(() => {
      spawn(between(500, 1000), {
        position: (p) => p.set(plusMinus(2), 0, plusMinus(2)),
        rotation: (q) => q.random(),
        setup: () => {
          variables.velocity.value.set(
            plusMinus(1),
            between(5, 18),
            plusMinus(1)
          )

          variables.offset.value.set(plusMinus(15), plusMinus(5), plusMinus(15))
        }
      })
    }, 100)

    return () => clearInterval(id)
  }, [])

  const inputs = useMemo(() => {
    const rotatedOffset = pipe(
      EffectAge,
      (v) => Mul(v, 1.2),
      (v) => Rotation3D(new Vector3(0.1, 0.8, 0.2), v),
      (v) => Mul(variables.offset, mat3(v))
    )

    return [
      Scale(
        Mul(
          Smoothstep(0, 0.1, ParticleProgress),
          Smoothstep(1, 0.8, ParticleProgress)
        )
      ),

      Velocity(variables.velocity),

      Translate(
        pipe(
          ParticleAge,
          (age) => Mul(age, Float(5)),
          (time) => Rotation3DY(time),
          (rotation) => Mul(rotatedOffset, rotation),
          (offset) =>
            Mul(offset, NormalizePlusMinusOne(Cos(Mul(ParticleAge, 2))))
        )
      ),

      SetColor(Mul(new Color("#ccc"), OneMinus(ParticleProgress))),
      Lifetime()
    ]
  }, [])

  return (
    <Particles
      maxParticles={300000}
      ref={particles}
      position-y={2}
      modules={inputs}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="white" />
    </Particles>
  )
}
