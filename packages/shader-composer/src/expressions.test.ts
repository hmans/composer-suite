import { $, glsl, isExpression } from "./expressions"

describe("glsl", () => {
  it("creates an Expression instance", () => {
    const expr = glsl`foo = bar;`
    expect(isExpression(expr)).toBe(true)
  })

  it("renders to a string through the render() function", () => {
    const expr = glsl`foo = bar;`
    expect(expr.render()).toBe("foo = bar;")
  })

  it("handles nested values", () => {
    const expr = $`foo = vec3(${[1, 2, 3]})`
    expect(expr.render()).toBe("foo = vec3(1.0, 2.0, 3.0)")
  })
})
