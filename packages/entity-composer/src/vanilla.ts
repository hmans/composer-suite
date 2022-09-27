export interface IEntity extends Record<string, any> {}

export type IndexFunction<Entity extends IEntity> = (entity: Entity) => boolean

export type WorldArgs<T extends IEntity> = {
  entities?: T[]
}

export function createWorld<Entity extends IEntity>({
  entities: initialEntities
}: WorldArgs<Entity> = {}) {
  const entities: Set<Entity> = new Set()
  const indices: Map<IndexFunction<Entity>, Set<Entity>> = new Map()

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
    for (const [fun, entities] of indices) {
      const inIndex = entities.has(entity)
      const shouldIndex = fun(entity)

      if (inIndex && !shouldIndex) entities.delete(entity)
      else if (!inIndex && shouldIndex) entities.add(entity)
    }
  }

  function index(fun: IndexFunction<Entity>) {
    if (!indices.has(fun)) {
      /* Create the new index */
      const entities = new Set<Entity>()
      indices.set(fun, entities)

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
