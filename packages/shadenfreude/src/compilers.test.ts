import { compileShader } from "./compilers"
import { code } from "./expressions"
import { assignment, statement } from "./lib/concatenator3000"
import { Float, Node } from "./tree"

describe("compileShader", () => {
  it("returns a vertexShader", () => {
    const v = Node("float", 1)
    const [shader] = compileShader(v)

    expect(shader.vertexShader).toMatchSnapshot()
  })

  it("returns a fragmentShader", () => {
    const v = Node("float", 1)
    const [shader] = compileShader(v)

    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("includes the node's chunks if it has them", () => {
    const v = Node("float", 1)

    v._config.vertexHeader = statement("uniform float u_time")
    v._config.vertexBody = assignment(
      "gl_Position",
      "vec4(sin(u_time), 0.0, 0.0, 1.0)"
    )
    v._config.fragmentHeader = statement("uniform float u_time")
    v._config.fragmentBody = assignment(
      "gl_FragColor",
      "vec4(cos(u_time), 0.0, 0.0, 1.0)"
    )

    const [shader] = compileShader(v)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })

  it("resolves dependencies to other variables", () => {
    const a = Node("float", 1)
    const b = Node("float", a)

    const [shader] = compileShader(b)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "void main()
      {
        /*** BEGIN: anon (1) ***/
        float float_anon_1;
        {
          float value = 1.0;
          float_anon_1 = value;
        }
        /*** END: anon (1) ***/

        /*** BEGIN: anon (2) ***/
        float float_anon_2;
        {
          float value = float_anon_1;
          float_anon_2 = value;
        }
        /*** END: anon (2) ***/

      }"
    `)
  })

  it("doesn't render the same dependency twice", () => {
    const a = Float(1)
    const b = Float(code`${a}`)
    const c = Float(code`${a} + ${b}`)

    const [shader] = compileShader(c)

    expect(shader.fragmentShader).toMatchInlineSnapshot(`
      "void main()
      {
        /*** BEGIN: anon (1) ***/
        float float_anon_1;
        {
          float value = 1.0;
          float_anon_1 = value;
        }
        /*** END: anon (1) ***/

        /*** BEGIN: anon (2) ***/
        float float_anon_2;
        {
          float value = float_anon_1;
          float_anon_2 = value;
        }
        /*** END: anon (2) ***/

        /*** BEGIN: anon (3) ***/
        float float_anon_3;
        {
          float value = float_anon_1 + float_anon_2;
          float_anon_3 = value;
        }
        /*** END: anon (3) ***/

      }"
    `)
  })
})
