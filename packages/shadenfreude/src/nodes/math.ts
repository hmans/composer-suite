import { type } from "../glslType"
import { float, GLSLType, Value, variable } from "../variables"

export const Addition = <T extends GLSLType>(a: Value<T>, b: Value<any>) =>
  variable(type(a), "a + b", {
    title: `Addition (${type(a)} + ${type(b)}`,
    inputs: { a, b }
  })

export const Subtraction = <T extends GLSLType>(a: Value<T>, b: Value<any>) =>
  variable(type(a), "a - b", {
    title: `Subtraction (${type(a)} - ${type(b)}`,
    inputs: { a, b }
  })

export const Division = <T extends GLSLType>(a: Value<T>, b: Value<any>) =>
  variable(type(a), "a / b", {
    title: `Division (${type(a)} / ${type(b)}`,
    inputs: { a, b }
  })

export const Multiplication = <T extends GLSLType>(
  a: Value<T>,
  b: Value<any>
) =>
  variable(type(a), "a * b", {
    title: `Multiplication (${type(a)} * ${type(b)}`,
    inputs: { a, b }
  })

export const Add = Addition
export const Subtract = Subtraction
export const Divide = Division
export const Multiply = Multiplication

export const Sin = (x: Value<"float">) => float("sin(x)", { inputs: { x } })
export const Cos = (x: Value<"float">) => float("cos(x)", { inputs: { x } })
