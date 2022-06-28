import { nodeFactory } from "../../factories"
import { GLSLType } from "../../types"
import { variable } from "../../variables"
import { VaryingNode } from "../util"

export const AttributeNode = nodeFactory<{ name: string; type: GLSLType }>(
  ({ name, type }) => ({
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
)
