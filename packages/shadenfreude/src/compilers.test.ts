import { compileShader } from "./compilers"
import { assignment, statement } from "./lib/concatenator3000"
import { bool, float, variable } from "./variables"

describe("compileShader", () => {
  it("returns a vertexShader", () => {
    const v = variable("float", 1)
    const shader = compileShader(v)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Unnamed (1) ***/
      /*** END: Unnamed (1) ***/

      void main()
      {
        /*** BEGIN: Unnamed (1) ***/
        float float_Unnamed_1;
        {
          float value = 1.00000;
          float_Unnamed_1 = value;
        }
        /*** END: Unnamed (1) ***/

      }"
    `)
  })

  it("returns a fragmentShader", () => {
    const v = variable("float", 1)
    const shader = compileShader(v)

    expect(shader.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Unnamed (1) ***/
      /*** END: Unnamed (1) ***/

      void main()
      {
        /*** BEGIN: Unnamed (1) ***/
        float float_Unnamed_1;
        {
          float value = 1.00000;
          float_Unnamed_1 = value;
        }
        /*** END: Unnamed (1) ***/

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
      "/*** BEGIN: Unnamed (1) ***/
      uniform float u_time;
      /*** END: Unnamed (1) ***/

      void main()
      {
        /*** BEGIN: Unnamed (1) ***/
        float float_Unnamed_1;
        {
          float value = 1.00000;
          gl_Position = vec4(sin(u_time), 0.0, 0.0, 1.0);
          float_Unnamed_1 = value;
        }
        /*** END: Unnamed (1) ***/

      }"
    `)

    expect(shader.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Unnamed (1) ***/
      uniform float u_time;
      /*** END: Unnamed (1) ***/

      void main()
      {
        /*** BEGIN: Unnamed (1) ***/
        float float_Unnamed_1;
        {
          float value = 1.00000;
          gl_FragColor = vec4(cos(u_time), 0.0, 0.0, 1.0);
          float_Unnamed_1 = value;
        }
        /*** END: Unnamed (1) ***/

      }"
    `)
  })

  it("resolves dependencies to other variables", () => {
    const float = variable("float", 1)
    const root = variable("float", float)

    const shader = compileShader(root)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Unnamed (1) ***/
      /*** END: Unnamed (1) ***/

      /*** BEGIN: Unnamed (2) ***/
      /*** END: Unnamed (2) ***/

      void main()
      {
        /*** BEGIN: Unnamed (1) ***/
        float float_Unnamed_1;
        {
          float value = 1.00000;
          float_Unnamed_1 = value;
        }
        /*** END: Unnamed (1) ***/

        /*** BEGIN: Unnamed (2) ***/
        float float_Unnamed_2;
        {
          float value = float_Unnamed_1;
          float_Unnamed_2 = value;
        }
        /*** END: Unnamed (2) ***/

      }"
    `)
  })

  it("doesn't render the same dependency twice", () => {
    const a = float(1)
    const b = bool(true, { inputs: { a, b: a } })

    const shader = compileShader(b)

    expect(shader.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Unnamed (1) ***/
      /*** END: Unnamed (1) ***/

      /*** BEGIN: Unnamed (2) ***/
      /*** END: Unnamed (2) ***/

      void main()
      {
        /*** BEGIN: Unnamed (1) ***/
        float float_Unnamed_1;
        {
          float value = 1.00000;
          float_Unnamed_1 = value;
        }
        /*** END: Unnamed (1) ***/

        /*** BEGIN: Unnamed (2) ***/
        bool bool_Unnamed_2;
        {
          float a = float_Unnamed_1;
          float b = float_Unnamed_1;
          bool value = true;
          bool_Unnamed_2 = value;
        }
        /*** END: Unnamed (2) ***/

      }"
    `)
  })
})
