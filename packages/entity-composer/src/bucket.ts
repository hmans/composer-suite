import { Event } from "./lib/event"

export interface IEntity {
  [key: string]: any
}

export const createBucket = <E extends IEntity>() => {
  const entities = new Array<E>()

  const onEntityAdded = new Event<E>()
  const onEntityRemoved = new Event<E>()
  const onEntityChanged = new Event<E>()

  const write = (
    entity: E,
    update?: Partial<E> | ((entity: E) => Partial<E>)
  ) => {
    const index = entities.indexOf(entity)

    /* Add the entity if we don't already have it */
    if (index === -1) {
      entities.push(entity)
      onEntityAdded.emit(entity)
    }

    if (update) {
      const changes = typeof update === "function" ? update(entity) : update

      /* Check if the update actually changed anything */
      let updated = false
      for (const key in changes)
        if (entity[key] !== changes[key]) updated = true

      /* Update the entity */
      Object.assign(entity, changes)

      /* Emit an event if the entity changed */
      if (updated) onEntityChanged.emit(entity)
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

  const derive = (predicate: (entity: E) => boolean = (entity: E) => true) => {
    /* Create bucket */
    const bucket = createBucket<E>()

    /* Add entities that match the predicate */
    for (const entity of entities) if (predicate(entity)) bucket.write(entity)

    /* Listen for new entities */
    onEntityAdded.addListener((entity) => {
      if (predicate(entity)) bucket.write(entity)
    })

    /* Listen for removed entities */
    onEntityRemoved.addListener((entity) => {
      bucket.remove(entity)
    })

    /* Listen for changed entities */
    onEntityChanged.addListener((entity) => {
      if (predicate(entity)) bucket.write(entity)
      else bucket.remove(entity)
    })

    return bucket
  }

  return {
    entities,
    onEntityAdded,
    onEntityRemoved,
    onEntityChanged,
    write,
    remove,
    derive
  }
}
