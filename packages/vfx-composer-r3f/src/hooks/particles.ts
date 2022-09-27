import { useConst } from "@hmans/use-const"
import { createParticleUnits, ParticleAttribute } from "vfx-composer"

export const useParticles = () => {
  return useConst(() => createParticleUnits())
}

export const useParticleAttribute = <
  T extends Parameters<typeof ParticleAttribute>[0]
>(
  ctor: () => T
) => useConst(() => ParticleAttribute(ctor()))
