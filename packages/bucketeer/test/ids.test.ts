import { id } from "../src/ids"

describe("id", () => {
  it("returns a numerical ID for the specified entity", () => {
    const entity = {}
    expect(id(entity)).toBe(0)
  })

  it("returns the same ID for the same entity", () => {
    const entity = {}
    expect(id(entity)).toBe(id(entity))
  })

  it("returns a different ID for different entities", () => {
    const entity1 = {}
    const entity2 = {}
    expect(id(entity1)).not.toBe(id(entity2))
  })
})
