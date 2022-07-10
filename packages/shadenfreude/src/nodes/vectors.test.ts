import { Vector2, Vector3, Vector4 } from "three"
import { glslRepresentation } from "../glslRepresentation"
import {
  JoinVector2,
  JoinVector3,
  JoinVector4,
  SplitVector2,
  SplitVector3,
  SplitVector4
} from "./vectors"

describe("Join", () => {
  it("creates a vec2 node from two components", () => {
    const v = JoinVector2(1, 2)
    expect(v.type).toBe("vec2")
    expect(glslRepresentation(v.value)).toBe("vec2(1.0, 2.0)")
  })

  it("creates a vec3 node from three components", () => {
    const v = JoinVector3(1, 2, 3)
    expect(v.type).toBe("vec3")
    expect(glslRepresentation(v.value)).toBe("vec3(1.0, 2.0, 3.0)")
  })

  it("creates a vec4 node from three components", () => {
    const v = JoinVector4(1, 2, 3, 4)
    expect(v.type).toBe("vec4")
    expect(glslRepresentation(v.value)).toBe("vec4(1.0, 2.0, 3.0, 4.0)")
  })
})

describe("Split", () => {
  it("splits a vec2 into two components", () => {
    const [a, b] = SplitVector2(new Vector2(1, 2))
    expect(a.type).toBe("float")
    expect(b.type).toBe("float")
  })

  it("splits a vec3 into three components", () => {
    const [a, b, c] = SplitVector3(new Vector3(1, 2, 3))
    expect(a.type).toBe("float")
    expect(b.type).toBe("float")
    expect(c.type).toBe("float")
  })

  it("splits a vec4 into four components", () => {
    const [a, b, c, d] = SplitVector4(new Vector4(1, 2, 3))
    expect(a.type).toBe("float")
    expect(b.type).toBe("float")
    expect(c.type).toBe("float")
    expect(d.type).toBe("float")
  })
})
