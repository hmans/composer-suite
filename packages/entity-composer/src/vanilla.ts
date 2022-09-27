export interface IEntity extends Record<string, any> {}

export type IndexFunction<Entity extends IEntity> = (entity: Entity) => boolean

export type WorldArgs<T extends IEntity> = {
  entities?: T[]
}

export class World<Entity extends IEntity> {
  entities: Set<Entity> = new Set()
  indices: Set<Index<Entity>> = new Set()

  constructor({ entities }: WorldArgs<Entity> = {}) {
    if (entities) {
      for (const entity of entities) {
        this.add(entity)
      }
    }
  }

  add(entity: Entity) {
    this.entities.add(entity)
    return entity
  }

  remove(entity: Entity) {
    this.entities.delete(entity)
  }

  update(entity: Entity, update?: Partial<Entity>) {
    if (update) Object.assign(entity, update)
    this.reindex(entity)
  }

  private reindex(entity: Entity) {
    for (const index of this.indices) {
      index.indexEntity(entity)
    }
  }
}

export class Index<Entity extends IEntity> {
  private entities: Set<Entity> = new Set()

  constructor(
    private world: World<Entity>,
    private fun: IndexFunction<Entity>
  ) {
    world.indices.add(this)
    this.rebuild()
  }

  [Symbol.iterator]() {
    return this.entities[Symbol.iterator]()
  }

  indexEntity(entity: Entity) {
    const shouldHave = this.fun(entity)
    const have = this.entities.has(entity)

    if (!have && shouldHave) {
      this.entities.add(entity)
    } else if (have && !shouldHave) {
      this.entities.delete(entity)
    }
  }

  rebuild() {
    this.entities.clear()
    for (const entity of this.world.entities) {
      this.indexEntity(entity)
    }
  }
}
