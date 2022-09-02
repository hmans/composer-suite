import { Input } from "shader-composer"
import { Color as ColorImpl, ColorRepresentation } from "three"
import { ModuleFactory } from ".."

export type ColorArgs = {
  color:
    | Input<"vec3">
    | ColorRepresentation
    | ((a: Input<"vec3">) => Input<"vec3">)
}

/**
 * Sets or modifies the material's color.
 *
 * @param param0.color The color to use. Can be a `THREE.Color`
 * instance, a color representation compatible with `THREE.ColorRepresentation`,
 * or a function that receives the current color and returns a new color.
 *
 * @example
 * Set the color to red:
 *
 * ```jsx
 * Color({ color: 0xff0000 })
 * Color({ color: "red" })
 * Color({ color: new Color(1, 0, 0) })
 * ```
 *
 * Just like any other module, you can use a Shader Composer sub-graph here:
 *
 * ```jsx
 * Color({
 *  color: Mul(new Color("hotpink"), NormalizePlusMinusOne(Sin(Time())))
 * })
 * ```
 *
 * You can also provide a function; this function will receive the _current_ color as its argument,
 * and is expected to return a new color.
 *
 * ```jsx
 * Color({
 *   color: (color) => Mul(color, 5)
 * })
 * ```
 */
export const Color: ModuleFactory<ColorArgs> =
  ({ color }) =>
  (state) => {
    /* Determine new color */
    const newColor =
      /* If it's a color representation, create a new color object */
      typeof color === "string" || typeof color === "number"
        ? new ColorImpl(color)
        : /* If it's a function, call it with the previous color */
        typeof color === "function"
        ? color(state.color)
        : /* Otherwise, return the color value as-is */
          color

    return {
      ...state,
      color: newColor
    }
  }
