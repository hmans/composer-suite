import { Vector3 } from "three"
import { node, Variable, variable } from "../src"
import { compileShader, compileVariable } from "../src/compilers"
import "./helpers"

describe("compileShader", () => {
  it("should compile a shader", () => {
    const TestNode = (input: { offset?: Variable<Vector3> } = {}) =>
      node({
        name: "Root",

        inputs: {
          offset: variable("vec3", input.offset || new Vector3(1, 2, 3))
        },

        vertex: {
          body: "csm_Position += offset;"
        }
      })

    const shader = compileShader(TestNode())

    expect(shader).toMatchSnapshot()
  })
})

describe("compileVariable", () => {
  it("compiles the given variable into its GLSL representation", () => {
    const v = variable("float", 1)
    expect(compileVariable(v)).toBeGLSL(`float ${v.name} = 1.0;`)
  })

  it("uses string values verbatim (assuming they are a reference to a variable)", () => {
    const v = variable("float", "foo")
    expect(compileVariable(v)).toBeGLSL(`float ${v.name} = foo;`)
  })

  it("renders non-scalar values using their GLSL representation", () => {
    const v = variable("vec3", new Vector3(1, 2, 3))
    expect(compileVariable(v)).toBeGLSL(`vec3 ${v.name} = vec3(1.0, 2.0, 3.0);`)
  })

  it("resolves variable references", () => {
    const source = variable("float", 1)
    const v = variable("float", source)
    expect(compileVariable(v)).toBeGLSL(`float ${v.name} = ${source.name};`)
  })
})
