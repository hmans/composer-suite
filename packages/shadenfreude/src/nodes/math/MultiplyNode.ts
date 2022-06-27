import { nodeFactory } from "../../factories"
import { Value } from "../../types"
import { OperatorNode } from "./OperatorNode"

export const MultiplyNode = nodeFactory<{
  a: Value
  b: Value
}>(({ a, b }) => OperatorNode({ operator: "*", a, b }))
