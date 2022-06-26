import { node } from "../src"
import { compileShader } from "../src/compilers"

describe("compileShader", () => {
  it("should compile a shader", () => {
    const root = node({
      name: "Root",
      vertex: {
        body: "csm_Position.x += 1.0;"
      }
    })

    const shader = compileShader(root)
    expect(shader).toMatchSnapshot()
  })
})
