import { compileShader } from "./compiler"
import { $, glsl } from "./expressions"
import { Snippet } from "./snippets"
import { Bool, Float, Master } from "./stdlib"

describe("compileShader", () => {
  it("compiles shader programs from the given unit", () => {
    const root = Bool(true)
    const [shader] = compileShader(root)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("embeds body chunks in scoped blocks, with a local `value` variable", () => {
    const root = Master({
      fragment: {
        body: $`gl_FragColor.rgb = vec3(1.0, 0.0, 0.0);`
      }
    })

    const [shader] = compileShader(root)
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("resolves dependencies to other units", () => {
    const f = Float(123)
    const root = Float(f)

    const [shader] = compileShader(root)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("resolves dependencies to other units from within expressions", () => {
    const f = Float(123)
    const root = Float(glsl`${f} * 2.0`)

    const [shader] = compileShader(root)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("resolves dependencies to expressions", () => {
    const a = glsl`123.0`
    const b = glsl`${a} + 4.0`
    const root = Float(glsl`${b}`)

    const [shader] = compileShader(root)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("allows resolves dependencies unique to specific programs", () => {
    const position = Float(1, { name: "Position (Vertex Only)" })
    const color = Float(2, { name: "Color (Fragment Only)" })

    const root = Master({
      vertex: { body: glsl`gl_Position = ${position};` },
      fragment: { body: glsl`gl_FragColor = ${color};` }
    })

    const [shader] = compileShader(root)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("supports snippets", () => {
    const double = Snippet(
      (name) => $`
			float ${name}(in float a) {
				return a * 2.0;
			}`
    )

    const root = Float($`${double}(1.0)`)

    const [shader] = compileShader(root)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  describe("when rendering units with registered uniforms", () => {
    const getShader = () => {
      const unitWithUniform = Float(0, {
        uniform: { value: 0 }
      })

      const [shader] = compileShader(unitWithUniform)

      return shader
    }

    it("adds uniform declarations to the program headers", () => {
      expect(getShader().vertexShader).toMatchSnapshot()
      expect(getShader().fragmentShader).toMatchSnapshot()
    })

    it("adds the uniform value object to the returned uniforms object", () => {
      expect(getShader().uniforms).toMatchInlineSnapshot(`
        Object {
          "u_Anonymous_1": Object {
            "value": 0,
          },
        }
      `)
    })
  })

  it("only includes the units needed in individual programs", () => {
    const a = Float(1, { name: "A" })
    const b = Float(2, { name: "B" })

    const master = Master({
      vertex: {
        body: $`foo = ${a};`
      },
      fragment: {
        body: $`bar = ${b}`
      }
    })

    const [shader] = compileShader(master)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("when encountering a varying unit, its value dependencies should only be resolved in the vertex program", () => {
    /* A unit that we expect only to show up in the vertex program. */
    const a = Float($`onlyInVertexProgramForSomeReason`, { name: "A" })

    /* A verying unit that sources `a`. It's also configured to use a varying, which
		means that its value expression will only appear in the vertex program -- for this reason,
		we also only need the value expression's dependencies in the vertex program. */
    const b = Float($`${a} + 1.0`, { name: "B", varying: true })

    /* A master unit that specifically uses the `b` unit from within the fragment program. */
    const root = Master({ name: "Master", fragment: { body: $`value = ${b}` } })

    const [shader] = compileShader(root)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("throws an error when encountering a unit that is not able to run in the requested program", () => {
    const a = Float(1, { name: "A", only: "vertex" })
    const root = Master({ fragment: { body: $`${a}` } })
    expect(() => compileShader(root)).toThrowErrorMatchingInlineSnapshot(
      `"Encountered a unit \\"A\\" that is only allowed in the vertex shader, but was encountered when compiling the fragment shader. Consider wrapping the value, or the derived value you're interested in, in a Unit that has a varying."`
    )
  })
})
