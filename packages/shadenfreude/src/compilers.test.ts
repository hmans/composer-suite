import { compileShader } from "./compilers"
import { variable } from "./variables"

describe("compileShader", () => {
  it("returns a vertexShader", () => {
    const v = variable("float")
    const shader = compileShader(v)
    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: anonymous_1 ***/
      /*** END: anonymous_1 ***/

      void main
      {
        /*** BEGIN: anonymous_1 ***/
        /*** END: anonymous_1 ***/

      }"
    `)
  })

  it("returns a fragmentShader", () => {
    const v = variable("float")
    const shader = compileShader(v)
    expect(shader.fragmenShader).toMatchInlineSnapshot(`
      "/*** BEGIN: anonymous_2 ***/
      /*** END: anonymous_2 ***/

      void main
      {
        /*** BEGIN: anonymous_2 ***/
        /*** END: anonymous_2 ***/

      }"
    `)
  })
})
