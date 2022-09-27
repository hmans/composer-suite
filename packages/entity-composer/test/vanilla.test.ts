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
