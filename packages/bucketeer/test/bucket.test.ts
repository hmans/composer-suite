import { archetype, createBucket, createDerivedBucket } from "../src"

describe("createBucket", () => {
  it("creates a bucket", () => {
    const bucket = createBucket()
    expect(bucket).toBeDefined()
  })
})

describe("add", () => {
  it("writes an entity into the bucket", () => {
    const bucket = createBucket()
    bucket.add({ count: 1 })
    expect(bucket.entities).toEqual([{ count: 1 }])
  })

  it("returns the object that is passed in to it", () => {
    const bucket = createBucket()
    const entity = {}
    expect(bucket.add(entity)).toBe(entity)
  })

  it("checks the bucket's type", () => {
    const bucket = createBucket<{ count: number }>()
    bucket.add({ count: 1 })
    expect(bucket.entities).toEqual([{ count: 1 }])
  })

  it("is idempotent", () => {
    const bucket = createBucket()
    const entity = { count: 1 }
    bucket.add(entity)
    bucket.add(entity)
    expect(bucket.entities).toEqual([entity])
  })

  it("emits an event", () => {
    const bucket = createBucket<{ count: number }>()
    const listener = jest.fn()
    bucket.onEntityAdded.addListener(listener)

    const entity = bucket.add({ count: 1 })
    expect(listener).toHaveBeenCalledWith(entity)
  })

  it("does not emit an event when an entity is added twice", () => {
    const entity = { count: 1 }
    const bucket = createBucket<{ count: number }>()
    const listener = jest.fn()
    bucket.onEntityAdded.addListener(listener)

    bucket.add(entity)
    bucket.add(entity)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe("update", () => {
  it("updates the entity", () => {
    const bucket = createBucket<{ count: number }>()
    const entity = bucket.add({ count: 1 })
    bucket.update(entity, { count: 2 })
    expect(bucket.entities).toEqual([{ count: 2 }])
  })

  it("emits an event when an entity is updated", () => {
    const bucket = createBucket<{ count: number }>()
    const listener = jest.fn()
    bucket.onEntityUpdated.addListener(listener)

    const entity = bucket.add({ count: 1 })
    bucket.update(entity, { count: 2 })
    expect(listener).toHaveBeenCalledWith(entity)
  })

  it("even emits an event when an entity is updated with the same values", () => {
    const bucket = createBucket<{ count: number }>()
    const listener = jest.fn()
    bucket.onEntityUpdated.addListener(listener)

    const entity = bucket.add({ count: 1 })
    bucket.update(entity, { count: 1 })
    expect(listener).toHaveBeenCalled()
  })
})

describe("remove", () => {
  it("removes an entity from the bucket", () => {
    const entity = { count: 1 }
    const bucket = createBucket()

    bucket.add(entity)
    expect(bucket.entities).toEqual([entity])

    bucket.remove(entity)
    expect(bucket.entities).toEqual([])
  })

  it("is idempotent", () => {
    const entity = { count: 1 }
    const bucket = createBucket()
    bucket.add(entity)
    bucket.remove(entity)
    bucket.remove(entity)
    expect(bucket.entities).toEqual([])
  })

  it("emits an event when the entity is removed", () => {
    const bucket = createBucket<{ count: number }>()
    const listener = jest.fn()
    bucket.onEntityRemoved.addListener(listener)

    const entity = bucket.add({ count: 1 })
    bucket.remove(entity)
    expect(listener).toHaveBeenCalledWith(entity)
  })
})

describe("createDerivedBucket", () => {
  it("creates a new bucket", () => {
    const bucket = createBucket()
    const derivedBucket = createDerivedBucket(bucket)
    expect(derivedBucket).toBeDefined()
  })

  it("if no predicate is given the derived bucket will receive the same entities", () => {
    const bucket = createBucket()
    const derivedBucket = createDerivedBucket(bucket)
    bucket.add({ count: 1 })
    expect(derivedBucket.entities).toEqual([{ count: 1 }])
  })

  it("if a predicate is given the derived bucket will only receive entities that match the predicate", () => {
    const bucket = createBucket<{ count: number }>()

    const derivedBucket = createDerivedBucket(
      bucket,
      (entity) => entity.count > 1
    )

    bucket.add({ count: 1 })
    expect(derivedBucket.entities).toEqual([])

    bucket.add({ count: 2 })
    expect(derivedBucket.entities).toEqual([{ count: 2 }])
  })

  it("it properly captures predicate type guards", () => {
    type Entity = { name?: string; age?: number }

    const world = createBucket<Entity>()
    const withName = createDerivedBucket(world, archetype("name"))

    const entity = world.add({ name: "Bob", age: 20 })
    expect(withName.entities).toEqual([entity])

    console.log(withName.entities[0].name.length)
    /* No real test, just making sure the type is correct */
  })
})
