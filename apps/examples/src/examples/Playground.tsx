import { between, plusMinus } from "randomish"
import { useEffect, useMemo, useRef } from "react"
import {
  Add,
  Cos,
  Float,
  mat3,
  Mix,
  Mul,
  NormalizePlusMinusOne,
  pipe,
  Rotation3D,
  Rotation3DY,
  Vec3,
  VertexPosition
} from "shader-composer"
import { Color, Vector3 } from "three"
import { Particles } from "vfx-composer/fiber"
import { LifetimeModule, Translate, Velocity } from "vfx-composer/modules"
import {
  EffectAge,
  ParticleAge,
  ParticleAttribute,
  ParticleProgress
} from "vfx-composer/units"

export default function Playground() {
  const particles = useRef<Particles>(null!)

  useEffect(() => {
    const { spawn } = particles.current

    const id = setInterval(() => {
      spawn(between(500, 1000), {
        position: (p) => p.set(plusMinus(2), 0, plusMinus(2)),
        rotation: (q) => q.random()
      })
    }, 100)

    return () => clearInterval(id)
  }, [])

  const inputs = useMemo(() => {
    const offset = ParticleAttribute(
      "vec3",
      () => new Vector3(plusMinus(10), 0, plusMinus(10))
    )

    const rotatedOffset = Mul(
      offset,
      mat3(Rotation3D(new Vector3(0.4, 0.8, 0.4), Add(EffectAge, ParticleAge)))
    )

    const position = [
      Velocity(
        ParticleAttribute(
          "vec3",
          () => new Vector3(plusMinus(2), between(8, 12), plusMinus(2))
        )
      ),

      Translate(
        pipe(
          ParticleAge,
          (age) => Mul(age, Float(5)),
          (time) => Rotation3DY(time),
          (rotation) => Mul(rotatedOffset, rotation),
          (offset) =>
            Mul(offset, NormalizePlusMinusOne(Cos(Mul(ParticleAge, 2))))
        )
      )
    ]

    return {
      position
    }
  }, [])

  return (
    <Particles
      maxParticles={300000}
      ref={particles}
      position-y={2}
      modules={inputs}
    >
      {/* You can assign any geometry. */}
      <boxGeometry args={[0.5, 0.5, 0.5]} />

      {/* And any material! */}
      <meshStandardMaterial color="white" />
    </Particles>
  )
}
