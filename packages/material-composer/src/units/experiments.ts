import {
  Input,
  Float,
  vec3,
  pipe,
  Add,
  Mul,
  Clamp01,
  Pow,
  $
} from "shader-composer"
import { Turbulence3D } from "shader-composer-toybox"

export const Random = (n: Input<"float">) =>
  Float($`fract(sin(${n}) * 1e4)`, { name: "Random (Float)" })

export type HeatOptions = {
  offset?: Input<"vec3" | "float">
  scale?: Input<"float">
  octaves?: number
  power?: Input<"float">
}

export const Heat = (
  v: Input<"vec3">,
  { offset = vec3(0, 0, 0), scale = 1, octaves = 5, power = 1 }: HeatOptions
) =>
  pipe(
    v,
    (v) => Add(v, offset),
    (v) => Mul(v, scale),
    (v) => Turbulence3D(v, octaves),
    (v) => Add(v, 0.5),
    (v) => Clamp01(v),
    (v) => Pow(v, power)
  )
