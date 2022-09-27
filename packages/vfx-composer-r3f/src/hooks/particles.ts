import { useConst } from "@hmans/use-const"
import { createParticles, ParticleAttribute } from "vfx-composer"

export const useParticles = () => useConst(() => createParticles())

export const useParticleAttribute = <
  T extends Parameters<typeof ParticleAttribute>[0]
>(
  ctor: () => T
) => useConst(() => ParticleAttribute(ctor()))
