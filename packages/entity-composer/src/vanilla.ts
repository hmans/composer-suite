export interface IEntity extends Record<string, any> {}

export type IndexFunction<Entity extends IEntity> = (entity: Entity) => boolean

export type WorldArgs<T extends IEntity> = {
  entities?: T[]
}

export class World<Entity extends IEntity> {
  entities: Set<Entity> = new Set()

  indices: Map<IndexFunction<Entity>, Set<Entity>> = new Map()

  constructor({ entities }: WorldArgs<Entity> = {}) {
    if (entities) {
      for (const entity of entities) {
        this.add(entity)
      }
    }
  }

  add(entity: Entity) {
    this.entities.add(entity)
    this.update(entity)
    return entity
  }

  remove(entity: Entity) {
    this.entities.delete(entity)
    this.update(entity)
  }

  update(
    entity: Entity,
    update?: Partial<Entity> | ((e: Entity) => Partial<Entity>)
  ) {
    if (typeof update === "function") Object.assign(entity, update(entity))
    else if (typeof update === "object") Object.assign(entity, update)

    /* Update indices */
    for (const [fun, entities] of this.indices) {
      const inIndex = entities.has(entity)
      const shouldIndex = fun(entity)

      if (inIndex && !shouldIndex) entities.delete(entity)
      else if (!inIndex && shouldIndex) entities.add(entity)
    }
  }

  index(fun: IndexFunction<Entity>) {
    if (!this.indices.has(fun)) {
      /* Create the new index */
      const entities = new Set<Entity>()
      this.indices.set(fun, entities)

      /* Populate the index */
      for (const entity of this.entities) {
        if (fun(entity)) entities.add(entity)
      }
    }

    return this.indices.get(fun)!
  }
}
