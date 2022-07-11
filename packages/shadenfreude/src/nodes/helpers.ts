import { GLSLType, Node, Value } from "../tree"

export const Pipe = <T extends GLSLType>(
  v: Value<T>,
  ...ops: ((v: Value<T>) => Value<T>)[]
) => ops.reduce((acc, op) => op(acc), v)
