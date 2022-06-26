import { Vector3 } from "three"
import { node, variable } from "../src"
import { compileShader, compileVariable } from "../src/compilers"

export const glsl = (glsl: string) => glsl.replace(/\s+/g, " ").trim()

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeGLSL(expected: string): R
    }
  }
}

expect.extend({
  toBeGLSL(received, expected) {
    const pass = glsl(received) === glsl(expected)

    if (pass) {
      return {
        message: () => `expected ${received} to not be equal to ${expected}`,
        pass: true
      }
    }

    return {
      message: () => `expected ${received} to be equal to ${expected}`,
      pass: false
    }
  }
})

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
