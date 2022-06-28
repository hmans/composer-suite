import { node } from "../../factories"
import { GLSLType } from "../../types"
import { variable } from "../../variables"
import { VaryingNode } from "../util"

export type AttributeNodeProps = { name: string; type: GLSLType }

export const AttributeNode = ({ name, type }: AttributeNodeProps) =>
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
