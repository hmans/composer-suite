import { Int, Vec2, Vec3 } from "./values"
import { float, vec3 } from "./casts"
import { glslRepresentation } from "../glslRepresentation"
import { Color, Vector2, Vector3 } from "three"

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
    const cast = vec3(new Color("red"))
    expect(glslRepresentation(cast)).toEqual(`vec3(vec3(1.0, 0.0, 0.0))`)
  })

  it("casts a Vector3 to a vec3", () => {
    const cast = vec3(new Vector3(1, 0, 0))
    expect(glslRepresentation(cast)).toEqual(`vec3(vec3(1.0, 0.0, 0.0))`)
  })

  it("casts multiple floats to a vec3", () => {
    const cast = vec3(1, 0, 0)
    expect(glslRepresentation(cast)).toEqual(`vec3(1.0, 0.0, 0.0)`)
  })

  it("casts multiple floats to a vec3", () => {
    const cast = vec3(new Vector2(1, 2), 3)
    expect(glslRepresentation(cast)).toEqual(`vec3(vec2(1.0, 2.0), 3.0)`)
  })
})
