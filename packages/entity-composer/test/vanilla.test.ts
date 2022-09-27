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
    const almostDeadFun = (e: Entity) => e.health !== undefined && e.health < 25

    it("updates the given entity", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 } })

      world.update(entity, { position: { x: 1, y: 1 } })

      expect(entity.position).toEqual({ x: 1, y: 1 })
    })

    it("accepts a function that returns a partial update", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 } })

      world.update(entity, (e) => ({ position: { x: e.position.x + 1, y: 1 } }))

      expect(entity.position).toEqual({ x: 1, y: 1 })
    })

    it("reindex the entity after updating", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 }, health: 100 })

      const almostDead = world.index(almostDeadFun)
      expect(almostDead).not.toContain(entity)

      world.update(entity, { health: 10 })
      expect(almostDead).toContain(entity)
    })

    it("reindexes the entity even when no update is given", () => {
      const world = new World<Entity>()
      const entity = world.add({ position: { x: 0, y: 0 }, health: 100 })
      const almostDead = world.index(almostDeadFun)
      expect(almostDead).not.toContain(entity)

      /* Now we can change the entity directly */
      entity.health = 10
      world.update(entity)

      expect(almostDead).toContain(entity)
    })
  })
})
