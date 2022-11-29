import { Matrix3, Matrix4 } from "three"
import { glslRepresentation } from "./glslRepresentation"
import * as glmatrix from "gl-matrix"

describe("glslRepresentation", () => {
  it("renders numbers as floats", () => {
    expect(glslRepresentation(1)).toBe("1.0")
  })

  it("keeps decimal places", () => {
    expect(glslRepresentation(1.2345)).toBe("1.2345")
  })

  it("keeps exponents", () => {
    expect(glslRepresentation(0.0000000001)).toBe("1e-10")
  })

  it("renders an array with 9 elements to a mat3", () => {
    expect(glslRepresentation([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(
      "mat3(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0)"
    )
  })

  it("renders a Matrix3 instance to mat3", () => {
    expect(glslRepresentation(new Matrix3())).toBe(
      "mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0)"
    )
  })

  it("renders gl-matrix mat3 to a mat3", () => {
    expect(
      glslRepresentation(
        glmatrix.mat3.set(glmatrix.mat3.create(), 1, 2, 3, 4, 5, 6, 7, 8, 9)
      )
    ).toBe("mat3(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0)")
  })

  it("renders an array with 16 elements to a mat4", () => {
    expect(
      glslRepresentation([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
      ])
    ).toBe(
      "mat4(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0)"
    )
  })

  it("renders a Matrix4 instance to mat4", () => {
    expect(glslRepresentation(new Matrix4())).toBe(
      "mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0)"
    )
  })

  it("renders gl-matrix mat4 to a mat4", () => {
    expect(glslRepresentation(glmatrix.mat4.create())).toBe(
      "mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0)"
    )
  })

  it("renders vector2-like objects to vec2", () => {
    expect(glslRepresentation({ x: 1, y: 2 })).toBe("vec2(1.0, 2.0)")
  })

  it("renders arrays with 2 numbers to vec2", () => {
    expect(glslRepresentation([1, 2])).toBe("vec2(1.0, 2.0)")
  })

  it("renders gl-matrix vec2 to a vec2", () => {
    expect(glslRepresentation(glmatrix.vec2.create())).toBe("vec2(0.0, 0.0)")
  })

  it("renders vector3-like objects to vec3", () => {
    expect(glslRepresentation({ x: 1, y: 2, z: 3 })).toBe("vec3(1.0, 2.0, 3.0)")
  })

  it("renders arrays with 3 numbers to vec3", () => {
    expect(glslRepresentation([1, 2, 3])).toBe("vec3(1.0, 2.0, 3.0)")
  })

  it("renders gl-matrix vec3 to a vec3", () => {
    expect(glslRepresentation(glmatrix.vec3.create())).toBe(
      "vec3(0.0, 0.0, 0.0)"
    )
  })

  it("renders vector4-like objects to vec4", () => {
    expect(glslRepresentation({ x: 1, y: 2, z: 3, w: 4 })).toBe(
      "vec4(1.0, 2.0, 3.0, 4.0)"
    )
  })

  it("renders arrays with 4 numbers to vec4", () => {
    expect(glslRepresentation([1, 2, 3, 4])).toBe("vec4(1.0, 2.0, 3.0, 4.0)")
  })

  it("renders gl-matrix vec4 to a vec4", () => {
    expect(glslRepresentation(glmatrix.vec4.create())).toBe(
      "vec4(0.0, 0.0, 0.0, 0.0)"
    )
  })
})
