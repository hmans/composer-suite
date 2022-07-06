import { compileShader } from "./compilers"
import { variable } from "./variables"

describe("compileShader", () => {
  it("returns a vertexShader", () => {
    const v = variable("float")
    const shader = compileShader(v)
    expect(shader.vertexShader).toMatchInlineSnapshot(`""`)
  })

  it("returns a fragmentShader", () => {
    const v = variable("float")
    const shader = compileShader(v)
    expect(shader.fragmenShader).toMatchInlineSnapshot(`""`)
  })
})
