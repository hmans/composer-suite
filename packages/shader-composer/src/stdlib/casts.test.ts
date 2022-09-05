import { Int } from "./values"
import { float } from "./casts"
import { glslRepresentation } from "../glslRepresentation"

describe("float", () => {
  it("returns an expression that casts the given value to a float", () => {
    const value = Int(1)
    const cast = float(value)

    expect(glslRepresentation(cast)).toEqual(
      `float(${value._unitConfig.variableName})`
    )
  })
})
