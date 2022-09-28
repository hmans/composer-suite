import { createEvent, Event } from "./lib/event"

export interface IEntity extends Record<string, any> {}

export type IndexFunction<Entity extends IEntity> = (entity: Entity) => boolean

export type WorldArgs<T extends IEntity> = {
  entities?: T[]
}

export type World<Entity extends IEntity> = ReturnType<
  typeof createWorld<Entity>
>

export function createWorld<Entity extends IEntity>({
  entities: initialEntities
}: WorldArgs<Entity> = {}) {
  const entities: Set<Entity> = new Set()
  const indices: Map<
    IndexFunction<Entity>,
    {
      entities: Set<Entity>
      onEntityAdded: Event<Entity>
      onEntityRemoved: Event<Entity>
    }
  > = new Map()

  if (initialEntities) {
    for (const entity of initialEntities) {
      add(entity)
    }
  }

  function add(entity: Entity) {
    entities.add(entity)
    update(entity)
    return entity
  }

  function remove(entity: Entity) {
    entities.delete(entity)
    update(entity)
  }

  function update(
    entity: Entity,
    update?: Partial<Entity> | ((e: Entity) => Partial<Entity>)
  ) {
    if (update) {
      if (typeof update === "function") Object.assign(entity, update(entity))
      else Object.assign(entity, update)
    }

    /* Update indices */
    for (const [fun, index] of indices) {
      const inIndex = index.entities.has(entity)
      const shouldIndex = fun(entity)

      if (inIndex && !shouldIndex) {
        index.entities.delete(entity)
        index.onEntityRemoved.emit(entity)
      } else if (!inIndex && shouldIndex) {
        index.entities.add(entity)
        index.onEntityAdded.emit(entity)
      }
    }
  }

  function index(fun: IndexFunction<Entity>) {
    if (!indices.has(fun)) {
      /* Create the new index */
      const entities = new Set<Entity>()
      indices.set(fun, {
        entities,
        onEntityAdded: createEvent(),
        onEntityRemoved: createEvent()
      })

      /* Populate the index */
      for (const entity of entities) {
        if (fun(entity)) entities.add(entity)
      }
    }

    return indices.get(fun)!
  }

  return {
    entities,
    add,
    remove,
    update,
    index
  }
}
