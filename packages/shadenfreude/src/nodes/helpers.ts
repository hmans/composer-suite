import { GLSLType, Node } from "../variables"

export const Pipe = <T extends Node<GLSLType>>(v: T, ...ops: ((v: T) => T)[]) =>
  ops.reduce((acc, op) => op(acc), v)
