import { type } from "../glslType"
import { Float, GLSLType, Value, Variable, Vec3 } from "../variables"
import { VertexNormalWorld, ViewMatrixAttribute } from "./geometry"
import { Varying } from "./inputs"

const buildMultiInputs = (values: Value[]) =>
  values.reduce((acc, v, i) => ({ ...acc, [`m_${i}`]: v }), {})

export const Operator = (title: string, operator: "+" | "-" | "*" | "/") => <
  T extends GLSLType
>(
  a: Value<T>,
  ...rest: Value[]
) => {
  const inputs = buildMultiInputs([a, ...rest])

  /* a + b + c + ... */
  const expression = Object.keys(inputs).join(operator)

  return Variable(type(a), expression, {
    title: `${title} (${type(a)})`,
    inputs
  })
}

export const Add = Operator("Add", "+")
export const Subtract = Operator("Subtract", "-")
export const Multiply = Operator("Multiply", "*")
export const Divide = Operator("Divide", "/")

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
