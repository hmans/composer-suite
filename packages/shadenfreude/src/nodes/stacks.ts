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
    in: { a: variable(type, a) },
    out: { value: variable(type, "in_a") },
    filters
  })
