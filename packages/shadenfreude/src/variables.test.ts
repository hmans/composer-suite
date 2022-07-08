import { compileShader } from "./compilers"
import { Variable } from "./variables"

describe("variable", () => {
  it("creates a variable of the specified type and value", () => {
    const v = Variable("float", 1)
    expect(v.type).toBe("float")
    expect(v.value).toBe(1)
  })

  it("supports string values (which will be used as verbatim expressions)", () => {
    const v = Variable("vec3", "vec3(1.0, 1.0, 1.0)")
    expect(v.value).toBe("vec3(1.0, 1.0, 1.0)")
  })

  it("supports a 'varying' flag that will automatically make it pass its data as a varying", () => {
    const v = Variable(
      "float",
      "1.0 + 2.0 + onlyAvailableInVertex.x", // a value expression that can only work in a vertex shader
      {
        title: "A variable with a varying",
        varying: true,
        vertexBody: `value += 3.0;` // Modiyfing the value before it gets put into the varying
      }
    )

    const c = compileShader(v)

    expect(c.vertexShader).toMatchSnapshot()
    expect(c.fragmentShader).toMatchSnapshot()
  })
})
