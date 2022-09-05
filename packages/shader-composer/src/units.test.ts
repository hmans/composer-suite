import { Vector2 } from "three"
import { compileShader } from "./compiler"
import { $ } from "./expressions"
import { glslRepresentation } from "./glslRepresentation"
import { Float, Vec2 } from "./stdlib"
import { Input, Unit } from "./units"

const glsl = glslRepresentation

describe("Unit", () => {
  it("creates a node of the specified type and value", () => {
    const v = Unit("float", 1)
    expect(v._unitConfig.type).toBe("float")
    expect(v._unitConfig.value).toBe(1)
    expect(glsl(v._unitConfig.value)).toBe("1.0")
  })

  it("supports string values (which will be used as verbatim expressions)", () => {
    const v = Unit("vec3", $`vec3(1.0, 1.0, 1.0)`)
    expect(glsl(v._unitConfig.value)).toBe("vec3(1.0, 1.0, 1.0)")
  })

  it("supports expression values", () => {
    const a = Float(1)
    const v = Unit("vec3", $`vec3(${a}, 1.0, 1.0)`)
    expect(glsl(v._unitConfig.value)).toBe(
      `vec3(${a._unitConfig.variableName}, 1.0, 1.0)`
    )
  })

  it("allows nodes to directly reference other nodes", () => {
    const source = Float(1)
    const v = Float(source)
    // expect(glsl(v._unitConfig.value).toBe(source)
    expect(glsl(v._unitConfig.value)).toBe(
      `float(${source._unitConfig.variableName})`
    )
  })

  it("supports a 'varying' flag that will automatically make it pass its data as a varying", () => {
    const v = Unit(
      "float",
      $`1.0 + 2.0 + onlyAvailableInVertex.x`, // a value expression that can only work in a vertex shader
      {
        name: "A variable with a varying",
        varying: true,
        vertex: { body: $`value += 3.0;` } // Modiyfing the value before it gets put into the varying
      }
    )

    const [c] = compileShader(v)

    expect(c.vertexShader).toMatchSnapshot()
    expect(c.fragmentShader).toMatchSnapshot()
  })

  it("supports constructing nodes through constructor functions", () => {
    const Double = (f: Input<"float">) => Float($`(${f}) * 2.0`)
    const v = Double(1)
    expect(glsl(v._unitConfig.value)).toBe("float((1.0) * 2.0)")
  })

  it("constructor functions can pass string values as expressions", () => {
    const Double = (f: Input<"float">) => Float($`(${f}) * 2.0`)
    const v = Double($`5.0`)
    expect(glsl(v._unitConfig.value)).toBe(`float((5.0) * 2.0)`)
  })

  it("constructor functions can pass references to other nodes", () => {
    const Double = (f: Input<"float">) => Float($`(${f}) * 2.0`)
    const a = Float(1)
    const v = Double(a)
    expect(glsl(v._unitConfig.value)).toBe(
      `float((${a._unitConfig.variableName}) * 2.0)`
    )
  })

  it("constructor functions can pass expression values to other nodes", () => {
    const Double = (f: Input<"float">) => Float($`(${f}) * 2.0`)
    const a = Float(5)
    const v = Double($`${a} + 5.0`)
    expect(glsl(v._unitConfig.value)).toBe(
      `float((${a._unitConfig.variableName} + 5.0) * 2.0)`
    )
  })
})

describe("Vec2", () => {
  it("accepts a THREE.Vector2 as value", () => {
    const vec2 = Vec2(new Vector2(1, 2))
    expect(glsl(vec2._unitConfig.value)).toBe("vec2(1.0, 2.0)")
  })
})
