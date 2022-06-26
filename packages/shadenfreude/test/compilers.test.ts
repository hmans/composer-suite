import { node, variable } from "../src"
import { compileShader, compileVariable } from "../src/compilers"

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

describe("compileVariable", () => {
  it("compiles the given variable into its GLSL representation", () => {
    const v = variable("float", 1)
    expect(compileVariable(v)).toEqual(`float ${v.name} = 1.0;`)
  })

  it("uses string values verbatim (assuming they are a reference to a variable)", () => {
    const v = variable("float", "foo")
    expect(compileVariable(v)).toEqual(`float ${v.name} = foo;`)
  })

  it("resolves variable references", () => {
    const source = variable("float", 1)
    const v = variable("float", source)
    expect(compileVariable(v)).toEqual(`float ${v.name} = ${source.name};`)
  })
})
