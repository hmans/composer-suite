import { Event } from "@hmans/event"

export interface IEntity {
  [key: string]: any
}

export type EntityWith<E, P extends keyof E> = E & { [K in P]-?: E[K] }

export type EntityPredicate<E, D extends E> = (entity: E) => entity is D

export const createBucket = <E extends IEntity>() => new Bucket<E>()

export class Bucket<E extends IEntity> {
  entities = new Array<E>()

  onEntityAdded = new Event<E>()
  onEntityRemoved = new Event<E>()
  onEntityUpdated = new Event<E>()

  derivedBuckets = new WeakMap();

  [Symbol.iterator]() {
    return this.entities[Symbol.iterator]()
  }

  has(entity: E) {
    return this.entities.includes(entity)
  }

  add(entity: E) {
    const index = this.entities.indexOf(entity)

    /* Add the entity if we don't already have it */
    if (index === -1) {
      this.entities.push(entity)
      this.onEntityAdded.emit(entity)
    }

    return entity
  }

  update(entity: E, update?: Partial<E> | ((entity: E) => Partial<E>)) {
    const index = this.entities.indexOf(entity)

    if (index !== -1) {
      if (update) {
        const changes = typeof update === "function" ? update(entity) : update
        Object.assign(entity, changes)
      }

      /* Emit an event if the entity changed */
      this.onEntityUpdated.emit(entity)
    }

    return entity
  }

  remove(entity: E) {
    /* Only act if we know about the entity */
    const index = this.entities.indexOf(entity)
    if (index === -1) return

    /* Remove entity from our list */
    this.entities[index] = this.entities[this.entities.length - 1]
    this.entities.pop()

    /* Emit event */
    this.onEntityRemoved.emit(entity)
  }

  clear() {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.remove(this.entities[i])
    }
  }

  derive<D extends E = E>(
    predicate: ((entity: E) => entity is D) | ((entity: E) => boolean) = () =>
      true
  ): Bucket<D> {
    /* Check if we already have a derived bucket for this predicate */
    if (this.derivedBuckets.has(predicate)) {
      return this.derivedBuckets.get(predicate)
    }

    /* Create bucket */
    const bucket = new Bucket<D>()

    /* Add to cache */
    this.derivedBuckets.set(predicate, bucket)

    /* Add entities that match the predicate */
    for (const entity of this.entities)
      if (predicate(entity)) bucket.add(entity)

    /* Listen for new entities */
    this.onEntityAdded.addListener((entity) => {
      if (predicate(entity)) bucket.add(entity)
    })

    /* Listen for removed entities */
    this.onEntityRemoved.addListener((entity) => {
      bucket.remove(entity as D)
    })

    /* Listen for changed entities */
    this.onEntityUpdated.addListener((entity) => {
      if (predicate(entity)) bucket.add(entity) && bucket.update(entity)
      else bucket.remove(entity as D)
    })

    return bucket as Bucket<D>
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
