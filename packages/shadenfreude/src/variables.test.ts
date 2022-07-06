import { variable } from "./variables"

describe("variable", () => {
  it("creates a variable of the specified type and value", () => {
    const v = variable("float", 1)
    expect(v.type).toBe("float")
    expect(v.value).toBe(1)
  })

  it("supports string values (which will be used as verbatim expressions)", () => {
    const v = variable("vec3", "vec3(1.0, 1.0, 1.0)")
    expect(v.value).toBe("vec3(1.0, 1.0, 1.0)")
  })
})
