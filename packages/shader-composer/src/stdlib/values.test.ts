import { Color, Vector2, Vector3 } from "three"
import { glslRepresentation } from "../glslRepresentation"
import { float, Int, mat2, NewVec3, vec2, vec3, Vec3, vec4 } from "./values"

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

  it("casts multiple components to a vec3", () => {
    const cast = vec3(new Vector2(1, 2), 3)
    expect(glslRepresentation(cast)).toEqual(`vec3(vec2(1.0, 2.0), 3.0)`)
  })
})

describe("vec3", () => {
  it("casts multiple components to a vec4", () => {
    const cast = vec4(new Vector2(1, 2), new Vector2(3, 4))
    expect(glslRepresentation(cast)).toEqual(
      `vec4(vec2(1.0, 2.0), vec2(3.0, 4.0))`
    )
  })
})

describe("mat2", () => {
  it("casts float components to a mat2", () => {
    const cast = mat2(1, 2, 3, 4)
    expect(glslRepresentation(cast)).toEqual(`mat2(1.0, 2.0, 3.0, 4.0)`)
  })

  it("casts vector components to a mat2", () => {
    const cast = mat2(new Vector2(1, 2), vec2(3, 4))
    expect(glslRepresentation(cast)).toEqual(
      `mat2(vec2(1.0, 2.0), vec2(3.0, 4.0))`
    )
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

  it("provides .x, .y, and .z accessors", () => {
    const v = NewVec3(new Vector3(), { variableName: "foo" })
    expect(glslRepresentation(v.x._unitConfig.value)).toBe("foo.x")
    expect(glslRepresentation(v.y._unitConfig.value)).toBe("foo.y")
    expect(glslRepresentation(v.z._unitConfig.value)).toBe("foo.z")
  })
})
