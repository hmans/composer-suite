import { Vector3 } from "three"
import { glslRepresentation } from "../glslRepresentation"
import { Vec3 } from "./values"

describe("Vec3", () => {
  it("provides .x, .y, and .z accessors", () => {
    const v = Vec3(new Vector3(), { variableName: "foo" })
    expect(glslRepresentation(v.x._unitConfig.value)).toBe("foo.x")
    expect(glslRepresentation(v.y._unitConfig.value)).toBe("foo.y")
    expect(glslRepresentation(v.z._unitConfig.value)).toBe("foo.z")
  })
})
