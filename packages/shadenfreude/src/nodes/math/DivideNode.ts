import { Value } from "../../types"
import { OperatorNode } from "./OperatorNode"

export type DivideNodeProps = {
  a: Value
  b: Value
}

export const DivideNode = ({ a, b }: DivideNodeProps) =>
  OperatorNode({ operator: "/", a, b })
