import { Event } from "./lib/event"

export interface IEntity {
  [key: string]: any
}

type CreateBucket<E extends IEntity> = typeof createBucket<E>

export type Bucket<E extends IEntity> = ReturnType<CreateBucket<E>>

export const createBucket = <E extends IEntity>() => {
  const entities = new Array<E>()

  const onEntityAdded = new Event<E>()
  const onEntityRemoved = new Event<E>()
  const onEntityUpdated = new Event<E>()

  const add = (entity: E) => {
    const index = entities.indexOf(entity)

    /* Add the entity if we don't already have it */
    if (index === -1) {
      entities.push(entity)
      onEntityAdded.emit(entity)
    }

    return entity
  }

  const update = (
    entity: E,
    update?: Partial<E> | ((entity: E) => Partial<E>)
  ) => {
    const index = entities.indexOf(entity)

    if (index !== -1) {
      if (update) {
        const changes = typeof update === "function" ? update(entity) : update
        Object.assign(entity, changes)
      }

      /* Emit an event if the entity changed */
      onEntityUpdated.emit(entity)
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

  const clear = () => {
    for (let i = entities.length - 1; i >= 0; i--) {
      remove(entities[i])
    }
  }

  return {
    [Symbol.iterator]() {
      return entities[Symbol.iterator]()
    },

    entities,
    onEntityAdded,
    onEntityRemoved,
    onEntityUpdated,
    add,
    update,
    remove,
    clear
  }
}

export const createDerivedBucket = <E extends IEntity, D extends E = E>(
  source: Bucket<E>,
  predicate: ((entity: E) => entity is D) | ((entity: E) => boolean) = () =>
    true
) => {
  /* Create bucket */
  const bucket = createBucket<D>()

  /* Add entities that match the predicate */
  for (const entity of source.entities)
    if (predicate(entity)) bucket.add(entity)

  /* Listen for new entities */
  source.onEntityAdded.addListener((entity) => {
    if (predicate(entity)) bucket.add(entity)
  })

  /* Listen for removed entities */
  source.onEntityRemoved.addListener((entity) => {
    bucket.remove(entity as D)
  })

  /* Listen for changed entities */
  source.onEntityUpdated.addListener((entity) => {
    if (predicate(entity)) bucket.add(entity) && bucket.update(entity)
    else bucket.remove(entity as D)
  })

  return bucket
}
