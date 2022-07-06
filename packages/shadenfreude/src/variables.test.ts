import { variable } from "./variables"

describe("variable", () => {
  it("creates a variable of the specified type", () => {
    const v = variable("float")
    expect(v.type).toBe("float")
  })

  it("assigns the specified value to the variable", () => {
    const v = variable("float", 1)
    expect(v.value).toBe(1)
  })

  it("supports typeless, empty variables with a type of undefined", () => {
    const v = variable(undefined)
    expect(v.type).toBeUndefined()
    v.value = 1
  })
})
