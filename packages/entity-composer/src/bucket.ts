import { Event } from "./lib/event"

export const createBucket = <E>() => {
  const entities = new Array<E>()

  const onEntityAdded = new Event<E>()
  const onEntityRemoved = new Event<E>()

  const write = (entity: E) => {
    const index = entities.indexOf(entity)

    /* Add the entity if we don't already have it */
    if (index === -1) {
      entities.push(entity)
      onEntityAdded.emit(entity)
    }

    return entity
  }

  const remove = (entity: E) => {
    /* Only act if we know about the entity */
    const index = entities.indexOf(entity)
    if (index === -1) return

    /* Remove entity from our list */
    entities[index] = entities[entities.length - 1]
    entities.pop()

    /* Emit event */
    onEntityRemoved.emit(entity)
  }

  return { entities, onEntityAdded, onEntityRemoved, write, remove }
}
