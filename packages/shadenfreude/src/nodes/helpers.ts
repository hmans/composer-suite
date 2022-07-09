import { GLSLType, Variable } from "../variables"

export const Pipe = <T extends GLSLType, V extends Variable<T>>(
  v: V,
  ...ops: ((v: V) => V)[]
) => ops.reduce((acc, op) => op(acc), v)
