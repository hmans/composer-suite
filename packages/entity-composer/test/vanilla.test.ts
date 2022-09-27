import { Index, World } from "../src/vanilla"

type Entity = {
  position: { x: number; y: number }
  velocity?: { x: number; y: number }
  health?: number
}

describe("World", () => {
  describe("constructor", () => {
    it("takes an optional list of initial entities", () => {
      const entities: Entity[] = [
        { position: { x: 0, y: 0 } },
        { position: { x: 1, y: 1 } }
      ]
      const world = new World({ entities })
      expect([...world.entities]).toEqual(entities)
    })
  })

  describe("add", () => {
    it("adds the entity to the world index", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 } })
      expect(world.entities).toContain(entity)
    })
  })

  describe("remove", () => {
    it("removes the entity from the world index", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 } })
      expect(world.entities).toContain(entity)
      world.remove(entity)
      expect(world.entities).not.toContain(entity)
    })
  })

  describe("update", () => {
    const almostDeadFun = (entity: Entity) =>
      entity.health !== undefined && entity.health < 25

    it("updates the given entity", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 } })

      world.update(entity, { position: { x: 1, y: 1 } })

      expect(entity.position).toEqual({ x: 1, y: 1 })
    })

    it("reindex the entity after updating", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 }, health: 100 })
      const almostDead = new Index(world, almostDeadFun)

      world.update(entity, { health: 10 })

      expect(almostDead).toContain(entity)
    })

    it("reindexes the entity even when no update is given", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 }, health: 100 })
      const almostDead = new Index(world, almostDeadFun)

      /* Now we can change the entity directly */
      entity.health = 10
      world.update(entity)

      expect(almostDead).toContain(entity)
    })
  })
})

describe("Index", () => {
  describe("instantiation", () => {
    it("adds the index to the world", () => {
      const world = new World<Entity>()
      const index = new Index(world, () => true)
      expect(world.indices).toContain(index)
    })
  })

  describe("indexing", () => {
    it("indexes entities that match the index function", () => {
      const world = new World<Entity>()
      const withHealth = new Index(world, (e) => e.health !== undefined)
      const entity = world.add({ position: { x: 0, y: 0 } })

      expect(withHealth).not.toContain(entity)

      world.update(entity, { health: 100 })

      expect(withHealth).toContain(entity)
    })
  })
})
