import { compileShader } from "./compilers"
import { code } from "./expressions"
import { glslRepresentation } from "./glslRepresentation"
import { Float, Value, Variable } from "./variables"

const glsl = glslRepresentation

describe("variable", () => {
  it("creates a variable of the specified type and value", () => {
    const v = Variable("float", 1)
    expect(v.type).toBe("float")
    expect(v.value).toBe(1)
    expect(glsl(v.value)).toBe("1.0")
  })

  it("supports string values (which will be used as verbatim expressions)", () => {
    const v = Variable("vec3", code`vec3(1.0, 1.0, 1.0)`)
    expect(glsl(v.value)).toBe("vec3(1.0, 1.0, 1.0)")
  })

  it("supports expression values", () => {
    const a = Float(1)
    const v = Variable("vec3", code`vec3(${a}, 1.0, 1.0)`)
    expect(glsl(v.value)).toBe(`vec3(${a._config.name}, 1.0, 1.0)`)
  })

  it("allows variables to directly reference other variables", () => {
    const source = Float(1)
    const v = Float(source)
    expect(v.value).toBe(source)
    expect(glsl(v.value)).toBe(source._config.name)
  })

  it("supports a 'varying' flag that will automatically make it pass its data as a varying", () => {
    const v = Variable(
      "float",
      code`1.0 + 2.0 + onlyAvailableInVertex.x`, // a value expression that can only work in a vertex shader
      {
        title: "A variable with a varying",
        varying: true,
        vertexBody: `value += 3.0;` // Modiyfing the value before it gets put into the varying
      }
    )

    const [c] = compileShader(v)

    expect(c.vertexShader).toMatchSnapshot()
    expect(c.fragmentShader).toMatchSnapshot()
  })

  it("supports constructing variables through constructor functions", () => {
    const Double = (f: Value<"float">) => Float(code`(${f}) * 2.0`)
    const v = Double(1)
    expect(glsl(v.value)).toBe("(1.0) * 2.0")
  })

  it("constructor functions can pass string values as expressions", () => {
    const Double = (f: Value<"float">) => Float(code`(${f}) * 2.0`)
    const v = Double(code`5.0`)
    expect(glsl(v.value)).toBe(`(5.0) * 2.0`)
  })

  it("constructor functions can pass references to other variables", () => {
    const Double = (f: Value<"float">) => Float(code`(${f}) * 2.0`)
    const a = Float(1)
    const v = Double(a)
    expect(glsl(v.value)).toBe(`(${a._config.name}) * 2.0`)
  })

  it("constructor functions can pass expression values to other variables", () => {
    const Double = (f: Value<"float">) => Float(code`(${f}) * 2.0`)
    const a = Float(5)
    const v = Double(code`${a} + 5.0`)
    expect(glsl(v.value)).toBe(`(${a._config.name} + 5.0) * 2.0`)
  })
})
