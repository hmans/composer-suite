import { useConst } from "@hmans/use-const"
import { Time } from "shader-composer"
import { Vector2 } from "three"
import { createParticleUnits, ParticleAttribute } from "vfx-composer/units"

export const useParticles = () => {
  const variables = useConst(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2())
  }))

  const particles = useConst(() =>
    createParticleUnits(variables.lifetime, variables.time)
  )

  const setLifetime = (duration: number, offset: number = 0) =>
    variables.lifetime.value.set(
      variables.time.value + offset,
      variables.time.value + offset + duration
    )

  return {
    ...variables,
    ...particles,
    setLifetime
  }
}

export const useParticleAttribute = <
  T extends Parameters<typeof ParticleAttribute>[0]
>(
  ctor: () => T
) => useConst(() => ParticleAttribute(ctor()))
