import { Event } from "@hmans/event"

export interface IEntity {
  [key: string]: any
}

type CreateBucket<E extends IEntity> = typeof createBucket<E>

export type Bucket<E extends IEntity> = ReturnType<CreateBucket<E>>

export type EntityWith<E, P extends keyof E> = E & { [K in P]-?: E[K] }

export type EntityPredicate<E, D extends E> = (entity: E) => entity is D

export const createBucket = <E extends IEntity>() => {
  const entities = new Array<E>()

  const onEntityAdded = new Event<E>()
  const onEntityRemoved = new Event<E>()
  const onEntityUpdated = new Event<E>()

  const derivedBuckets = new WeakMap()

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

  const derive = <D extends E = E>(
    predicate: ((entity: E) => entity is D) | ((entity: E) => boolean) = () =>
      true
  ) => {
    /* Check if we already have a derived bucket for this predicate */
    if (derivedBuckets.has(predicate)) {
      return derivedBuckets.get(predicate) as Bucket<D>
    }

    /* Create bucket */
    const bucket = createBucket<D>()

    /* Add to cache */
    derivedBuckets.set(predicate, bucket)

    /* Add entities that match the predicate */
    for (const entity of entities) if (predicate(entity)) bucket.add(entity)

    /* Listen for new entities */
    onEntityAdded.addListener((entity) => {
      if (predicate(entity)) bucket.add(entity)
    })

    /* Listen for removed entities */
    onEntityRemoved.addListener((entity) => {
      bucket.remove(entity as D)
    })

    /* Listen for changed entities */
    onEntityUpdated.addListener((entity) => {
      if (predicate(entity)) bucket.add(entity) && bucket.update(entity)
      else bucket.remove(entity as D)
    })

    return bucket as Bucket<D>
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
    clear,
    derive
  }
}

/* ID */

const entityToId = new WeakMap<IEntity, number>()

let nextId = 0

export const id = (entity: IEntity) => {
  if (!entityToId.has(entity)) entityToId.set(entity, nextId++)
  return entityToId.get(entity)
}

/* Archetypes */

export const isArchetype = <E extends IEntity, P extends keyof E>(
  entity: E,
  ...properties: P[]
): entity is EntityWith<E, P> => {
  for (const key of properties) if (!(key in entity)) return false
  return true
}

const archetypeCache = new Map()

export const archetype = <E extends IEntity, P extends keyof E>(
  ...properties: P[]
): EntityPredicate<E, EntityWith<E, P>> => {
  const normalizedProperties = properties.sort().filter((p) => !!p && p !== "")
  const key = JSON.stringify(normalizedProperties)

  if (archetypeCache.has(key)) return archetypeCache.get(key)

  const predicate = (entity: E): entity is EntityWith<E, P> =>
    isArchetype(entity, ...properties)

  archetypeCache.set(key, predicate)

  return predicate
}
