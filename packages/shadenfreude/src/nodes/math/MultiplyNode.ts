import { Value } from "../../types"
import { OperatorNode } from "./OperatorNode"

export type MultiplyNodeProps = {
  a: Value
  b: Value
}

export const MultiplyNode = ({ a, b }: MultiplyNodeProps) =>
  OperatorNode({ operator: "*", a, b })
