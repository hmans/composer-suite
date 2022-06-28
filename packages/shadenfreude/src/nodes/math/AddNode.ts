import { Value } from "../../types"
import { OperatorNode } from "./OperatorNode"

export type AddNodeProps = {
  a: Value
  b: Value
}

export const AddNode = ({ a, b }: AddNodeProps) =>
  OperatorNode({ operator: "+", a, b })
