import { type } from "../glslType"
import { float, GLSLType, Value, variable } from "../variables"

export const Addition = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a + b", {
    title: `Addition (${type(a)} + ${type(b)}`,
    inputs: { a, b }
  })

export const Subtraction = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a - b", {
    title: `Subtraction (${type(a)} - ${type(b)}`,
    inputs: { a, b }
  })

export const Division = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a / b", {
    title: `Division (${type(a)} / ${type(b)}`,
    inputs: { a, b }
  })

export const Multiplication = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a * b", {
    title: `Multiplication (${type(a)} * ${type(b)}`,
    inputs: { a, b }
  })

export const add = Addition
export const subtract = Subtraction
export const divide = Division
export const multiply = Multiplication

export const sin = (x: Value<"float">) => float("sin(x)", { inputs: { x } })
export const cos = (x: Value<"float">) => float("cos(x)", { inputs: { x } })
