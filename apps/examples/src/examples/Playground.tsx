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
  pipe,
  Rotation3DY,
  VertexPosition
} from "shader-composer"
import { Color, Vector3 } from "three"
import { Module, ParticleAge, ParticleAttribute, Particles } from "vfx-composer"

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

  const inputs = {
    position: pipe(VertexPosition, (p) => Add(p, ParticleAge)),
    color: new Color("hotpink"),
    alpha: 1
  }

  return (
    <Particles ref={particles} position-y={2} inputs={inputs}>
      {/* You can assign any geometry. */}
      <boxGeometry />

      {/* And any material! */}
      <meshStandardMaterial color="white" />
    </Particles>
  )
}
