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

        /*** BEGIN: Add (float) (2) ***/
        float float_Add_float_2;
        {
          float m_0 = float_Anonymous_float_1_0_1;
          float m_1 = 1.0;
          float value = m_0+m_1;
          float_Add_float_2 = value;
        }
        /*** END: Add (float) (2) ***/

        /*** BEGIN: Multiply (float) (3) ***/
        float float_Multiply_float_3;
        {
          float m_0 = float_Add_float_2;
          float m_1 = 5.0;
          float value = m_0*m_1;
          float_Multiply_float_3 = value;
        }
        /*** END: Multiply (float) (3) ***/

      }"
    `)
  })
})
