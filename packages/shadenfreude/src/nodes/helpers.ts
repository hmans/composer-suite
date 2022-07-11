import { GLSLType, INode, Node, Value } from "../tree"

export const Pipe = <T extends GLSLType>(
  v: Value<T>,
  ...ops: ((v: Value<T>) => INode<T>)[]
) => ops.reduce((acc, op) => op(acc), v) as Node<T>
