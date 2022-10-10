import { IEntity } from "./bucket"

export type EntityWith<E, P extends keyof E> = E & { [K in P]-?: E[K] }

export const isArchetype = <E extends IEntity, P extends keyof E>(
  entity: E,
  ...properties: P[]
): entity is EntityWith<E, P> => {
  console.log(entity, properties)
  for (const key of properties) if (!(key in entity)) return false
  return true
}

export const archetype =
  <E extends IEntity, P extends keyof E>(...properties: P[]) =>
  (entity: E): entity is EntityWith<E, P> =>
    isArchetype(entity, ...properties)
