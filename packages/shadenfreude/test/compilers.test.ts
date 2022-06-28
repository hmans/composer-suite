import { Color, Vector3 } from "three"
import { ColorNode, CSMMasterNode, node, variable, Vector3Node } from "../src"
import { compileShader, compileVariable } from "../src/compilers"
import "./helpers"

describe("compileShader", () => {
  it("compiles a node into a shader", () => {
    const testNode = node({
      name: "Root",

      inputs: {
        offset: variable("vec3", new Vector3(1, 2, 3))
      },

      vertex: {
        body: "csm_Position += offset;"
      }
    })

    const shader = compileShader(testNode)

    expect(shader).toMatchSnapshot()
  })

  it("resolves dependencies to other nodes", () => {
    const color = ColorNode({ color: new Color("hotpink") })
    const offset = Vector3Node({ value: new Vector3(1, 2, 3) })
    const root = CSMMasterNode({
      position: offset,
      diffuseColor: color
    })

    const shader = compileShader(root)
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
