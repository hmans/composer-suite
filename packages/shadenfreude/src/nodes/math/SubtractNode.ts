import { Value } from "../../types"
import { OperatorNode } from "./OperatorNode"

export type SubtractNodeProps = {
  a: Value
  b: Value
}

export const SubtractNode = ({ a, b }: SubtractNodeProps) =>
  OperatorNode({ operator: "-", a, b })
