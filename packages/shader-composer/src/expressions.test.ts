import { glsl, isExpression } from "./expressions"

describe("glsl", () => {
	it("creates an Expression instance", () => {
		const expr = glsl`foo = bar;`
		expect(isExpression(expr)).toBe(true)
	})

	it("renders to a string through the render() function", () => {
		const expr = glsl`foo = bar;`
		expect(expr.render()).toBe("foo = bar;")
	})
})
