import {
  IShaderNodeWithDefaultOutput,
  Parameter,
  ShaderNode,
  ValueType,
  variable
} from "../shadenfreude"
import {
  AddNode,
  DivideNode,
  MixNode,
  MultiplyNode,
  SubtractNode
} from "./math"

export const varying = <T extends ValueType>(type: T, value: Parameter<T>) =>
  ShaderNode({
    varyings: { v: variable(type, value) },
    outputs: { value: variable(type, "v") }
  })

export const mix = <T extends ValueType>(
  a: Parameter<T>,
  b: Parameter<T>,
  factor: Parameter<"float">
) => MixNode({ a, b, factor })

const makeMathHelper = (
  ctor:
    | typeof AddNode
    | typeof SubtractNode
    | typeof MultiplyNode
    | typeof DivideNode
) => {
  const helper = <T extends ValueType>(
    first: Parameter<T>,
    ...rest: Parameter[]
  ): IShaderNodeWithDefaultOutput<T> =>
    ctor({
      a: first,
      b: rest.length > 1 ? helper(rest.shift(), ...rest) : rest[0]
    })

  return helper
}

export const add = makeMathHelper(AddNode)
export const subtract = makeMathHelper(SubtractNode)
export const multiply = makeMathHelper(MultiplyNode)
export const divide = makeMathHelper(DivideNode)
