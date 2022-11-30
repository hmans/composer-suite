import { glslRepresentation } from "../glslRepresentation"
import { UniformUnit } from "./variables"

describe("Uniform", () => {
  it("uses its uniform name as its string representation", () => {
    const uniform = UniformUnit("float", 0, { variableName: "foo" })
    expect(glslRepresentation(uniform)).toBe("u_foo")
  })

  it("uses u_variableName as the default name if none other is given", () => {
    const uniform = UniformUnit("float", 0, { variableName: "foo123" })
    expect(glslRepresentation(uniform)).toBe("u_foo123")
  })

  it("allows the user to set a uniform name explicitly", () => {
    const uniform = UniformUnit("float", 0, {
      variableName: "foo",
      uniformName: "u_bar"
    })
    expect(glslRepresentation(uniform)).toBe("u_bar")
  })
})
