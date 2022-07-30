import { useFrame } from "@react-three/fiber"
import { between, plusMinus } from "randomish"
import { useMemo, useRef } from "react"
import {
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
  Billboard,
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

  useFrame(() => {
    const { spawn } = particles.current

    spawn(between(100, 200), {
      position: (p) => p.set(plusMinus(2), 0, plusMinus(2)),
      rotation: (q) => q.random(),
      setup: () => {
        variables.velocity.value.set(plusMinus(1), between(5, 18), plusMinus(1))
        variables.offset.value.set(plusMinus(15), plusMinus(5), plusMinus(15))
      }
    })
  })

  const inputs = useMemo(() => {
    const rotatedOffset = pipe(
      EffectAge,
      (v) => Mul(v, 2),
      (v) => Rotation3D(new Vector3(0.3, 1, 0.3), v),
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
          (v) => Mul(v, 3),
          (v) => Rotation3DY(v),
          (v) => Mul(rotatedOffset, v),
          (v) =>
            Mul(
              v,
              pipe(
                ParticleAge,
                (v) => Mul(v, 1.5),
                (v) => Cos(v),
                (v) => NormalizePlusMinusOne(v)
              )
            )
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
