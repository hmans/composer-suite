import {
  ValueType,
  Parameter,
  IShaderNodeWithDefaultOutput
} from "../shadenfreude"
import {
  MixNode,
  AddNode,
  MultiplyNode,
  DivideNode,
  SubtractNode
} from "./math"

export const mix = <T extends ValueType>(
  a: Parameter<T>,
  b: Parameter<T>,
  factor: Parameter<"float">
) => MixNode({ a, b, factor })

export const add = <T extends ValueType>(
  first: Parameter<T>,
  ...rest: Parameter[]
): IShaderNodeWithDefaultOutput<T> =>
  AddNode({
    a: first,
    b: rest.length > 1 ? add(rest.shift(), ...rest) : rest[0]
  })

export const multiply = <T extends ValueType>(
  first: Parameter<T>,
  ...rest: Parameter[]
): IShaderNodeWithDefaultOutput<T> =>
  MultiplyNode({
    a: first,
    b: rest.length > 1 ? multiply(rest.shift(), ...rest) : rest[0]
  })

export const divide = <T extends ValueType>(
  first: Parameter<T>,
  ...rest: Parameter[]
): IShaderNodeWithDefaultOutput<T> =>
  DivideNode({
    a: first,
    b: rest.length > 1 ? divide(rest.shift(), ...rest) : rest[0]
  })

export const subtract = <T extends ValueType>(
  first: Parameter<T>,
  ...rest: Parameter[]
): IShaderNodeWithDefaultOutput<T> =>
  SubtractNode({
    a: first,
    b: rest.length > 1 ? subtract(rest.shift(), ...rest) : rest[0]
  })
