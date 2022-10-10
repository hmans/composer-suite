import { Event } from "./lib/event"

export const createBucket = <E>() => {
  const entities = new Array<E>()

  const onEntityAdded = new Event<E>()
  const onEntityRemoved = new Event<E>()

  const write = (entity: E) => {
    entities.push(entity)
    onEntityAdded.emit(entity)
    return entity
  }

  const remove = (entity: E) => {
    const index = entities.indexOf(entity)
    if (index === -1) return

    entities[index] = entities[entities.length - 1]
    entities.pop()
    onEntityRemoved.emit(entity)
  }

  return { entities, onEntityAdded, onEntityRemoved, write, remove }
}
