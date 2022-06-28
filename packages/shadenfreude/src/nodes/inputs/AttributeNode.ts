import { node } from "../../factories"
import { GLSLType } from "../../types"
import { variable } from "../../variables"
import { VaryingNode } from "../util"

export type AttributeNodeProps<T extends GLSLType> = { name: string; type: T }

export const AttributeNode = <T extends GLSLType>({
  name,
  type
}: AttributeNodeProps<T>) =>
  node({
    inputs: {
      v_value: variable(type, VaryingNode({ type, source: name }))
    },
    outputs: {
      value: variable(type, "v_value")
    },
    vertex: {
      header: `attribute ${type} ${name};`
    }
  })
