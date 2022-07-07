import { Vector2, Vector3, Vector4 } from "three"
import { Join, Split } from "./vectors"

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

describe("Split", () => {
  it("splits a vec2 into two components", () => {
    const split = Split(new Vector2(1, 2))

    expect(split).toMatchObject({
      x: { type: "float", value: "vector.x" },
      y: { type: "float", value: "vector.y" }
    })
  })

  it("splits a vec3 into three components", () => {
    const split = Split(new Vector3(1, 2, 3))

    expect(split).toMatchObject({
      x: { type: "float", value: "vector.x" },
      y: { type: "float", value: "vector.y" },
      z: { type: "float", value: "vector.z" }
    })
  })

  it("splits a vec4 into four components", () => {
    const split = Split(new Vector4(1, 2, 3))

    expect(split).toMatchObject({
      x: { type: "float", value: "vector.x" },
      y: { type: "float", value: "vector.y" },
      z: { type: "float", value: "vector.z" },
      w: { type: "float", value: "vector.w" }
    })
  })
})
