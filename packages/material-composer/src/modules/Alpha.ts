import { Input } from "shader-composer"
import { Module } from ".."

export type AlphaArgs = {
  alpha: Input<"float"> | ((a: Input<"float">) => Input<"float">)
}

/**
 * Sets or modifies the fragment's alpha value.
 *
 * @param param0.alpha The alpha value to use. If a function is provided,
 * it will be called with the current alpha value.
 *
 * @example
 * This will set the alpha value to 0.5:
 *
 * ```jsx
 * Alpha({ alpha: 0.5 })
 * ```
 *
 * Just like any other module, you can use a Shader Composer sub-graph here:
 *
 * ```jsx
 * Alpha({ alpha: NormalizePlusMinusOne(Sin(Time())) })
 * ```
 *
 * Alternatively, you can pass a function; this function will receive the _current_ alpha value as its argument.
 * This gives you a chance to modify the value instead of overwriting it:
 *
 * ```jsx
 * Alpha({ alpha: (alpha) => Mul(alpha, 0.5) })
 * ```
 */
export const Alpha =
  ({ alpha }: AlphaArgs): Module =>
  (state) => ({
    ...state,
    alpha: typeof alpha === "function" ? alpha(state.alpha) : alpha
  })
