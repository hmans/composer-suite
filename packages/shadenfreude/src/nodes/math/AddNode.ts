import { GLSLType, Value } from "../../types"
import { OperatorNode } from "./OperatorNode"

export type AddNodeProps<T extends GLSLType> = {
  a: Value<T>
  b: Value<any>
}

export const AddNode = <T extends GLSLType>({ a, b }: AddNodeProps<T>) =>
  OperatorNode({ operator: "+", a, b })
