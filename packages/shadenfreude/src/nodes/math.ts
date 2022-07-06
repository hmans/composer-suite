import { type } from "../glslType"
import { float, GLSLType, Value, variable } from "../variables"

export const Operator = (title: string, operator: "+" | "-" | "*" | "/") => <
  T extends GLSLType
>(
  a: Value<T>,
  b: Value<any>
) =>
  variable(type(a), `a ${operator} b`, {
    title: `${title} (${type(a)} ${operator} ${type(b)}`,
    inputs: { a, b }
  })

export const Add = Operator("Add", "+")
export const Subtract = Operator("Subtract", "-")
export const Multiply = Operator("Multiply", "*")
export const Divide = Operator("Divide", "/")

export const Sin = (x: Value<"float">) => float("sin(x)", { inputs: { x } })
export const Cos = (x: Value<"float">) => float("cos(x)", { inputs: { x } })
