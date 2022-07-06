import { type } from "../glslType"
import { float, GLSLType, Value, variable } from "../variables"

const buildMultiInputs = (values: Value[]) =>
  values.reduce((acc, v, i) => ({ ...acc, [`m_${i}`]: v }), {})

export const Operator = (title: string, operator: "+" | "-" | "*" | "/") => <
  T extends GLSLType
>(
  a: Value<T>,
  ...rest: Value[]
) => {
  const inputs = buildMultiInputs([a, ...rest])

  return variable(type(a), Object.keys(inputs).join(operator), {
    title: `${title} (${type(a)})`,
    inputs
  })
}

export const Add = Operator("Add", "+")
export const Subtract = Operator("Subtract", "-")
export const Multiply = Operator("Multiply", "*")
export const Divide = Operator("Divide", "/")

export const Sin = (x: Value<"float">) => float("sin(x)", { inputs: { x } })
export const Cos = (x: Value<"float">) => float("cos(x)", { inputs: { x } })
