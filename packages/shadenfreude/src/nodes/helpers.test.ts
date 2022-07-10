import { compileShader } from "../compilers"
import { Float } from "../tree"
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
        /*** BEGIN: anon (1) ***/
        float float_anon_1;
        {
          float value = 1.0;
          float_anon_1 = value;
        }
        /*** END: anon (1) ***/

        /*** BEGIN: Add (float) (2) ***/
        float float_Add_float_2;
        {
          float value = float_anon_1 + 1.0;
          float_Add_float_2 = value;
        }
        /*** END: Add (float) (2) ***/

        /*** BEGIN: Multiply (float) (3) ***/
        float float_Multiply_float_3;
        {
          float value = float_Add_float_2 * 5.0;
          float_Multiply_float_3 = value;
        }
        /*** END: Multiply (float) (3) ***/

      }"
    `)
  })
})
