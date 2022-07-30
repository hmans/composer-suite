import { upTo } from "randomish"
import { Color, Vector3 } from "three"
import { makeParticles } from "vfx-composer/fiber"
import { ParticleAttribute } from "vfx-composer/units"

export const Simple = () => {
  const Effect = makeParticles()

  const variables = {
    velocity: ParticleAttribute("vec3", () => new Vector3()),
    color: ParticleAttribute("vec3", () => new Color())
  }

  return (
    <group>
      <Effect.Root>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </Effect.Root>

      <Effect.Emitter
        continuous
        setup={(p) => {
          p.randomDirection().multiplyScalar(upTo(10))
        }}
      />
    </group>
  )
}
