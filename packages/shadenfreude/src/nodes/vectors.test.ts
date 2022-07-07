import { Join } from "./vectors"

describe("Join", () => {
  it("creates a vec2 variable from two components", () => {
    const v = Join(1, 2)
    expect(v.type).toBe("vec2")
    expect(v.inputs.x).toBe(1)
    expect(v.inputs.y).toBe(2)
  })

  it("creates a vec3 variable from three components", () => {
    const v = Join(1, 2, 3)
    expect(v.type).toBe("vec3")
    expect(v.inputs.x).toBe(1)
    expect(v.inputs.y).toBe(2)
    expect(v.inputs.z).toBe(3)
  })

  it("creates a vec4 variable from three components", () => {
    const v = Join(1, 2, 3, 4)
    expect(v.type).toBe("vec4")
    expect(v.inputs.x).toBe(1)
    expect(v.inputs.y).toBe(2)
    expect(v.inputs.z).toBe(3)
    expect(v.inputs.w).toBe(4)
  })
})
