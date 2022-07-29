import { between, plusMinus, upTo } from "randomish"
import { useEffect, useRef } from "react"
import {
  $,
  Add,
  Clamp01,
  Cos,
  Div,
  Float,
  InstanceMatrix,
  Mix,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Rotation3D,
  Rotation3DY,
  Sin,
  SplitVector3,
  Vec3,
  VertexPosition
} from "shader-composer"
import { Color, Vector3 } from "three"
import {
  EffectAge,
  LifetimeModule,
  Module,
  OffsetModule,
  ParticleAge,
  ParticleAttribute,
  ParticleProgress,
  Particles,
  VelocityModule
} from "vfx-composer"

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

  const offset = ParticleAttribute(
    "vec3",
    () => new Vector3(plusMinus(10), 0, plusMinus(10))
  )

  const rotatedOffset = Mul(
    offset,
    $`mat3(${Rotation3D(
      new Vector3(0.4, 0.8, 0.4),
      Add(EffectAge, ParticleAge)
    )})`
  )

  const position = Vec3(
    pipe(
      VertexPosition,

      VelocityModule(
        () => new Vector3(plusMinus(2), between(8, 12), plusMinus(2))
      ),

      OffsetModule(
        pipe(
          ParticleAge,
          (age) => Mul(age, Float(5)),
          (time) => Rotation3DY(time),
          (rotation) => Mul(rotatedOffset, rotation),
          (offset) =>
            Mul(offset, NormalizePlusMinusOne(Cos(Mul(ParticleAge, 2))))
        )
      )
    ),

    { varying: true }
  )

  const color = pipe(Vec3(new Color("#ccc")), LifetimeModule(), (v) =>
    Mix(v, new Color("#000"), ParticleProgress)
  )

  const inputs = {
    position,
    color,
    alpha: 1
  }

  return (
    <Particles
      maxParticles={300000}
      ref={particles}
      position-y={2}
      inputs={inputs}
    >
      {/* You can assign any geometry. */}
      <boxGeometry args={[0.5, 0.5, 0.5]} />

      {/* And any material! */}
      <meshStandardMaterial color="white" />
    </Particles>
  )
}
