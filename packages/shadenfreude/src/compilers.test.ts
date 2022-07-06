import { compileShader } from "./compilers"
import { assignment, statement } from "./lib/concatenator3000"
import { bool, float, variable } from "./variables"

describe("compileShader", () => {
  it("returns a vertexShader", () => {
    const v = variable("float", 1)
    const shader = compileShader(v)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "void main()
      {
        /*** BEGIN: Anonymous float = 1.0 (1) ***/
        float float_Anonymous_float_1_0_1;
        {
          float value = 1.0;
          float_Anonymous_float_1_0_1 = value;
        }
        /*** END: Anonymous float = 1.0 (1) ***/

      }"
    `)
  })

  it("returns a fragmentShader", () => {
    const v = variable("float", 1)
    const shader = compileShader(v)

    expect(shader.fragmentShader).toMatchInlineSnapshot(`
      "void main()
      {
        /*** BEGIN: Anonymous float = 1.0 (1) ***/
        float float_Anonymous_float_1_0_1;
        {
          float value = 1.0;
          float_Anonymous_float_1_0_1 = value;
        }
        /*** END: Anonymous float = 1.0 (1) ***/

      }"
    `)
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

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Anonymous float = 1.0 (1) ***/
      uniform float u_time;
      /*** END: Anonymous float = 1.0 (1) ***/

      void main()
      {
        /*** BEGIN: Anonymous float = 1.0 (1) ***/
        float float_Anonymous_float_1_0_1;
        {
          float value = 1.0;
          gl_Position = vec4(sin(u_time), 0.0, 0.0, 1.0);
          float_Anonymous_float_1_0_1 = value;
        }
        /*** END: Anonymous float = 1.0 (1) ***/

      }"
    `)

    expect(shader.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Anonymous float = 1.0 (1) ***/
      uniform float u_time;
      /*** END: Anonymous float = 1.0 (1) ***/

      void main()
      {
        /*** BEGIN: Anonymous float = 1.0 (1) ***/
        float float_Anonymous_float_1_0_1;
        {
          float value = 1.0;
          gl_FragColor = vec4(cos(u_time), 0.0, 0.0, 1.0);
          float_Anonymous_float_1_0_1 = value;
        }
        /*** END: Anonymous float = 1.0 (1) ***/

      }"
    `)
  })

  it("resolves dependencies to other variables", () => {
    const float = variable("float", 1)
    const root = variable("float", float)

    const shader = compileShader(root)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "void main()
      {
        /*** BEGIN: Anonymous float = 1.0 (1) ***/
        float float_Anonymous_float_1_0_1;
        {
          float value = 1.0;
          float_Anonymous_float_1_0_1 = value;
        }
        /*** END: Anonymous float = 1.0 (1) ***/

        /*** BEGIN: Anonymous float = anonymous_4 (2) ***/
        float float_Anonymous_float_anonymous_4_2;
        {
          float value = float_Anonymous_float_1_0_1;
          float_Anonymous_float_anonymous_4_2 = value;
        }
        /*** END: Anonymous float = anonymous_4 (2) ***/

      }"
    `)
  })

  it("doesn't render the same dependency twice", () => {
    const a = float(1)
    const b = bool(true, { inputs: { a, b: a } })

    const shader = compileShader(b)

    expect(shader.fragmentShader).toMatchInlineSnapshot(`
      "void main()
      {
        /*** BEGIN: Anonymous float = 1.0 (1) ***/
        float float_Anonymous_float_1_0_1;
        {
          float value = 1.0;
          float_Anonymous_float_1_0_1 = value;
        }
        /*** END: Anonymous float = 1.0 (1) ***/

        /*** BEGIN: Anonymous bool = true (2) ***/
        bool bool_Anonymous_bool_true_2;
        {
          float a = float_Anonymous_float_1_0_1;
          float b = float_Anonymous_float_1_0_1;
          bool value = true;
          bool_Anonymous_bool_true_2 = value;
        }
        /*** END: Anonymous bool = true (2) ***/

      }"
    `)
  })
})
