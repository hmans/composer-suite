import { pipe } from "fp-ts/function"
import { Float, Fract, Input, Mul, OneMinus, Step } from "shader-composer"

export const Grid2D = (
  v: Input<"vec2">,
  scale: Input<"float"> = 1,
  thickness: Input<"float"> = 0.1
) => {
  const { x, y } = Mul(v, scale)

  const fx = Fract(x)
  const fy = Fract(y)

  const sx = Step(thickness, fx)
  const sy = Step(thickness, fy)

  return pipe(
    Mul(sx, sy),
    (v) => OneMinus(v),
    (v) => Float(v, { name: "Grid2D" })
  )
}
