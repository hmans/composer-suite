import { Int } from "./values"
import { float, vec3 } from "./casts"
import { glslRepresentation } from "../glslRepresentation"
import { Color } from "three"

describe("float", () => {
  it("returns an expression that casts the given value to a float", () => {
    const value = Int(1)
    const cast = float(value)

    expect(glslRepresentation(cast)).toEqual(
      `float(${glslRepresentation(value)})`
    )
  })
})

describe("vec3", () => {
  it("returns an expression that casts the given value to a vec3", () => {
    const value = new Color("red")
    const cast = vec3(value)

    expect(glslRepresentation(cast)).toEqual(`vec3(vec3(1.0, 0.0, 0.0))`)
  })
})
