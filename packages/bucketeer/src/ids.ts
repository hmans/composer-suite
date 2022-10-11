import { IEntity } from "./bucket"

const ids = new WeakMap<IEntity, number>()

let nextId = 0

export const id = (entity: IEntity) => {
  if (!ids.has(entity)) ids.set(entity, nextId++)
  return ids.get(entity)
}
