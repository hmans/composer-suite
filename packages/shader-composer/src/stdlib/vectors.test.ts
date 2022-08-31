import { Vector2, Vector3, Vector4 } from "three"
import { SplitVector2, SplitVector3, SplitVector4 } from "./vectors"

describe("Split", () => {
	it("splits a vec2 into two components", () => {
		const [a, b] = SplitVector2(new Vector2(1, 2))
		expect(a._unitConfig.type).toBe("float")
		expect(b._unitConfig.type).toBe("float")
	})

	it("splits a vec3 into three components", () => {
		const [a, b, c] = SplitVector3(new Vector3(1, 2, 3))
		expect(a._unitConfig.type).toBe("float")
		expect(b._unitConfig.type).toBe("float")
		expect(c._unitConfig.type).toBe("float")
	})

	it("splits a vec4 into four components", () => {
		const [a, b, c, d] = SplitVector4(new Vector4(1, 2, 3))
		expect(a._unitConfig.type).toBe("float")
		expect(b._unitConfig.type).toBe("float")
		expect(c._unitConfig.type).toBe("float")
		expect(d._unitConfig.type).toBe("float")
	})
})
