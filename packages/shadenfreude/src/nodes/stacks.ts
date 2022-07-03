import {
  IShaderNode,
  Parameter,
  ShaderNode,
  ValueType,
  variable
} from "../shadenfreude"

export const StackNode = <T extends ValueType>(type: T, name = "Stack") => (
  a: Parameter<T>,
  filters: IShaderNode[] = []
) =>
  ShaderNode({
    name,
    inputs: { a: variable(type, a) },
    outputs: { value: variable(type, "inputs.a") },
    filters
  })
