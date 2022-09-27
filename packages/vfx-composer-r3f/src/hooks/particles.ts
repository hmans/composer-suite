import { useConst } from "@hmans/use-const"
import { createParticleLifetime, ParticleAttribute } from "vfx-composer"

export const useParticleLifetime = () =>
  useConst(() => createParticleLifetime())

export const useParticleAttribute = <
  T extends Parameters<typeof ParticleAttribute>[0]
>(
  ctor: () => T
) => useConst(() => ParticleAttribute(ctor()))
