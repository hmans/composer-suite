import { Matrix3, Matrix4 } from "three"
import { glsl } from "./expressions"
import { glslRepresentation } from "./glslRepresentation"

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

  it("renders mat3", () => {
    expect(glslRepresentation(new Matrix3())).toBe(
      "mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0)"
    )
  })

  it("renders mat4", () => {
    expect(glslRepresentation(new Matrix4())).toBe(
      "mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0)"
    )
  })
})
