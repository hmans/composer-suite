import { nodeFactory, Value } from "../.."
import { OperatorNode } from "./OperatorNode"

export const DivideNode = nodeFactory<{
  a: Value
  b: Value
}>(({ a, b }) => OperatorNode({ operator: "/", a, b }))
