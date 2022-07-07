import { GLSLType, Variable } from "../variables"

export const Pipe = <T extends Variable<GLSLType>>(
  v: T,
  ...ops: ((v: T) => T)[]
) => ops.reduce((acc, op) => op(acc), v)
