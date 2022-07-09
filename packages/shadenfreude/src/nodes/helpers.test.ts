import { compileShader } from "../compilers"
import { Float } from "../variables"
import { Pipe } from "./helpers"
import { Add, Multiply } from "./math"

describe("Pipe", () => {
  it("pipes a value through multiple transformations", () => {
    const v = Pipe(
      Float(1),
      (v) => Add(v, 1),
      (v) => Multiply(v, 5)
    )

    const [shader] = compileShader(v)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "void main()
      {
        /*** BEGIN: Multiply (float) (1) ***/
        float float_Multiply_float_1;
        {
          float value = m_0*m_1;
          float_Multiply_float_1 = value;
        }
        /*** END: Multiply (float) (1) ***/

      }"
    `)
  })
})
