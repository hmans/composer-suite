import { GLSLType, Value } from "../variables"

export const Pipe = <T extends GLSLType>(
  v: Value<T>,
  ...ops: ((v: Value<T>) => Value<T>)[]
) => ops.reduce((acc, op) => op(acc), v)
