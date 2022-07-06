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
})
