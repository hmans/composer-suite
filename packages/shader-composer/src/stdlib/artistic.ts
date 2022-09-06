import { pipe } from "fp-ts/function"
import { GLSLType, Input, Unit } from "../units"
import { VertexNormal, ViewDirection } from "./variables"
import { Abs, Add, Lerp, Mul, Pow, Saturate, Smoothstep } from "./math"
import { Float } from "./values"
import { Dot } from "./vectors"

export type FresnelProps = {
  normal?: Input<"vec3">
  alpha?: Input<"float">
  bias?: Input<"float">
  intensity?: Input<"float">
  power?: Input<"float">
  factor?: Input<"float">
}

/**
 * A Shader Unit that calculates the fresnel effect.
 *
 * @param param0.normal The normal of the surface. Defaults to {@link VertexNormal}.
 * @param param0.alpha The alpha value of the fresnel effect. Defaults to 1.
 * @param param0.bias The bias of the fresnel effect. Defaults to 0.
 * @param param0.intensity The intensity of the fresnel effect. Defaults to 1.
 * @param param0.power The power of the fresnel effect. Defaults to 1.
 * @returns A shader unit holding the fresnel value.
 */
export const Fresnel = ({
  normal = VertexNormal.world,
  bias = 0,
  intensity = 1,
  power = 2,
  factor = 1
}: FresnelProps = {}) =>
  Float(
    pipe(
      normal,
      (v) => Dot(ViewDirection, v),
      (v) => Add(factor, v),
      (v) => Abs(v),
      (v) => Pow(v, power),
      (v) => Mul(v, intensity),
      (v) => Add(v, bias),
      (v) => Saturate(v)
    ),
    { name: "Fresnel" }
  )

export type GradientStops<T extends GLSLType = "vec3"> = GradientStop<T>[]

export type GradientStop<T extends GLSLType = "vec3"> = [
  Input<T>,
  Input<"float">
]

/**
 * A Shader Unit that returns the value of a gradient at a specified position.
 *
 * @param f The position within the gradient.
 * @param stops A configuration of value stops making up the gradient. See {@link GradientStops}.
 * @returns A shader unit holding the gradient value at the specified position.
 */
export const Gradient = <T extends GLSLType = "vec3">(
  f: Input<"float">,
  ...stops: GradientStops<T>
) => {
  let color = stops[0][0]

  for (let i = 1; i < stops.length; i++) {
    const stop = stops[i]
    const previous = stops[i - 1]
    color = Lerp(color, stop[0], Smoothstep(previous[1], stop[1], f))
  }

  return color as Unit<T>
}
