import { glslRepresentation } from "../glslRepresentation"
import { vec3 } from "./values"

describe("vec3", () => {
  it("constructs a Vec3 unit from three components", () => {
    const v = vec3(1, 2, 3)
    expect(glslRepresentation(v._unitConfig.value)).toBe("vec3(1.0, 2.0, 3.0)")
  })

  it("uses default values of 0 for its components", () => {
    const v = vec3()
    expect(glslRepresentation(v._unitConfig.value)).toBe("vec3(0.0, 0.0, 0.0)")
  })
})
