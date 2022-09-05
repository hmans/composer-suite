import { Vector3 } from "three"
import { glslRepresentation } from "../glslRepresentation"
import { NewVec3, Vec3 } from "./values"

describe("Vec3", () => {
  it("provides .x, .y, and .z accessors", () => {
    const v = Vec3(new Vector3(), { variableName: "foo" })
    expect(glslRepresentation(v.x._unitConfig.value)).toBe("foo.x")
    expect(glslRepresentation(v.y._unitConfig.value)).toBe("foo.y")
    expect(glslRepresentation(v.z._unitConfig.value)).toBe("foo.z")
  })
})

describe("NewVec3", () => {
  it("value is a unit", () => {
    const unit = Vec3(new Vector3(1, 2, 3))
    const v = NewVec3(unit)
    expect(glslRepresentation(v._unitConfig.value)).toEqual(
      `vec3(${glslRepresentation(unit)})`
    )
  })

  it("value is a JS value with its own GLSL representation", () => {
    const value = new Vector3(1, 2, 3)
    const v = NewVec3(value)
    expect(glslRepresentation(v._unitConfig.value)).toEqual(
      `vec3(vec3(1.0, 2.0, 3.0))`
    )
  })

  it("value is an array of components", () => {
    const value = [1, 2, 3]
    const v = NewVec3(value)
    expect(glslRepresentation(v._unitConfig.value)).toEqual(
      `vec3(1.0, 2.0, 3.0)`
    )
  })

  it("value is a 'nested' array. Well, kinda.", () => {
    const v = NewVec3([1, ...[2, 3]])
    expect(glslRepresentation(v._unitConfig.value)).toEqual(
      `vec3(1.0, 2.0, 3.0)`
    )
  })
})
