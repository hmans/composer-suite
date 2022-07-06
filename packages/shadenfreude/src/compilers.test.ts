import { compileShader } from "./compilers"
import { assignment, statement } from "./lib/concatenator3000"
import { variable } from "./variables"

describe("compileShader", () => {
  it("returns a vertexShader", () => {
    const v = variable("float", 1)
    const shader = compileShader(v)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: anonymous_1 ***/
      /*** END: anonymous_1 ***/

      void main
      {
        /*** BEGIN: anonymous_1 ***/
        float anonymous_1 = 1.00000;
        {
        }
        /*** END: anonymous_1 ***/

      }"
    `)
  })

  it("returns a fragmentShader", () => {
    const v = variable("float", 1)
    const shader = compileShader(v)

    expect(shader.fragmenShader).toMatchInlineSnapshot(`
      "/*** BEGIN: anonymous_2 ***/
      /*** END: anonymous_2 ***/

      void main
      {
        /*** BEGIN: anonymous_2 ***/
        float anonymous_2 = 1.00000;
        {
        }
        /*** END: anonymous_2 ***/

      }"
    `)
  })

  it("includes the variable's chunks if it has them", () => {
    const v = variable("float", 1)

    v.vertex = {
      header: statement("uniform float u_time"),
      body: assignment("gl_Position", "vec4(sin(u_time), 0.0, 0.0, 1.0)")
    }

    v.fragment = {
      header: statement("uniform float u_time"),
      body: assignment("gl_FragColor", "vec4(cos(u_time), 0.0, 0.0, 1.0)")
    }

    const shader = compileShader(v)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: anonymous_3 ***/
      uniform float u_time;
      /*** END: anonymous_3 ***/

      void main
      {
        /*** BEGIN: anonymous_3 ***/
        float anonymous_3 = 1.00000;
        {
          gl_Position = vec4(sin(u_time), 0.0, 0.0, 1.0);
        }
        /*** END: anonymous_3 ***/

      }"
    `)

    expect(shader.fragmenShader).toMatchInlineSnapshot(`
      "/*** BEGIN: anonymous_3 ***/
      uniform float u_time;
      /*** END: anonymous_3 ***/

      void main
      {
        /*** BEGIN: anonymous_3 ***/
        float anonymous_3 = 1.00000;
        {
          gl_FragColor = vec4(cos(u_time), 0.0, 0.0, 1.0);
        }
        /*** END: anonymous_3 ***/

      }"
    `)
  })
})
