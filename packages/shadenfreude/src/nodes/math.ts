import { Float, Value, Vec3 } from "../variables"
import { VertexNormalWorld, ViewMatrixAttribute } from "./geometry"
import { Varying } from "./inputs"

export const Sin = (x: Value<"float">) => Float("sin(x)", { inputs: { x } })
export const Cos = (x: Value<"float">) => Float("cos(x)", { inputs: { x } })

export type FresnelProps = {
  alpha?: Value<"float">
  bias?: Value<"float">
  intensity?: Value<"float">
  power?: Value<"float">
  factor?: Value<"float">
}

export const Fresnel = ({
  alpha = 1,
  bias = 0,
  intensity = 1,
  power = 2,
  factor = 1
}: FresnelProps = {}) =>
  Float(0, {
    inputs: {
      alpha,
      bias,
      intensity,
      power,
      factor,
      ViewDirection,
      normal: VertexNormalWorld
    },
    fragmentBody: `
      float f_a = (factor + dot(ViewDirection, normal));
      float f_fresnel = bias + intensity * pow(abs(f_a), power);
      f_fresnel = clamp(f_fresnel, 0.0, 1.0);
      value = f_fresnel;
    `
  })

export const ViewDirection = Varying(
  "vec3",
  Vec3("vec3(-ViewMatrix[0][2], -ViewMatrix[1][2], -ViewMatrix[2][2])", {
    inputs: { ViewMatrix: ViewMatrixAttribute },
    only: "vertex"
  })
)
