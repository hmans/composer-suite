import { createBucket } from "../src"

describe("createBucket", () => {
  it("creates a bucket", () => {
    const bucket = createBucket()
    expect(bucket).toBeDefined()
  })
})

describe("write", () => {
  it("writes an entity into the bucket", () => {
    const bucket = createBucket()
    bucket.write(1)
    expect(bucket.entities).toEqual([1])
  })

  it("returns the object that is passed in to it", () => {
    const bucket = createBucket()
    const entity = {}
    expect(bucket.write(entity)).toBe(entity)
  })

  it("checks the bucket's type", () => {
    const bucket = createBucket<{ count: number }>()
    bucket.write({ count: 1 })
    expect(bucket.entities).toEqual([{ count: 1 }])
  })

  it("emits an event when an entity is added", () => {
    const bucket = createBucket<{ count: number }>()
    const listener = jest.fn()
    bucket.onEntityAdded.addListener(listener)

    const entity = bucket.write({ count: 1 })
    expect(listener).toHaveBeenCalledWith(entity)
  })
})
