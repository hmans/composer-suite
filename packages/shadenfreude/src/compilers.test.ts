import { compileShader } from "./compilers"
import { assignment, statement } from "./lib/concatenator3000"
import { bool, float, variable } from "./variables"

describe("compileShader", () => {
  it("returns a vertexShader", () => {
    const v = variable("float", 1)
    const shader = compileShader(v)

    expect(shader.vertexShader).toMatchSnapshot()
  })

  it("returns a fragmentShader", () => {
    const v = variable("float", 1)
    const shader = compileShader(v)

    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("includes the variable's chunks if it has them", () => {
    const v = variable("float", 1)

    v.vertexHeader = statement("uniform float u_time")
    v.vertexBody = assignment("gl_Position", "vec4(sin(u_time), 0.0, 0.0, 1.0)")
    v.fragmentHeader = statement("uniform float u_time")
    v.fragmentBody = assignment(
      "gl_FragColor",
      "vec4(cos(u_time), 0.0, 0.0, 1.0)"
    )

    const shader = compileShader(v)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("resolves dependencies to other variables", () => {
    const float = variable("float", 1)
    const root = variable("float", float)

    const shader = compileShader(root)

    expect(shader.vertexShader).toMatchSnapshot()
  })

  it("doesn't render the same dependency twice", () => {
    const a = float(1)
    const b = bool(true, { inputs: { a, b: a } })

    const shader = compileShader(b)

    expect(shader.fragmentShader).toMatchSnapshot()
  })
})
