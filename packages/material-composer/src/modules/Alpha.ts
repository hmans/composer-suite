import { Input } from "shader-composer"
import { Module } from ".."

export type AlphaArgs = {
  alpha: Input<"float"> | ((a: Input<"float">) => Input<"float">)
}

/**
 * Sets or modifies the fragment's alpha value.
 *
 * @example
 * This will set the alpha value to 0.5:
 *
 * ```jsx
 * <modules.Alpha alpha={0.5} />
 * ```
 *
 * @example
 * Just like any other module, you can use a Shader Composer sub-graph here:
 *
 * ```jsx
 * <modules.Alpha alpha={NormalizePlusMinusOne(Sin(Time()))} />
 * ```
 *
 * @example
 * Alternatively, you can pass a function; this function will receive the _current_ alpha value as its argument.
 * This gives you a chance to modify the value instead of overwriting it:
 *
 * ```jsx
 * <modules.Alpha alpha={(alpha) => Mul(alpha, 0.5)} />
 * ```
 *
 * @param param0.alpha The alpha value to use. If a function is provided, it will be called with the current alpha value.
 */
export const Alpha =
  ({ alpha }: AlphaArgs): Module =>
  (state) => ({
    ...state,
    alpha: typeof alpha === "function" ? alpha(state.alpha) : alpha
  })
