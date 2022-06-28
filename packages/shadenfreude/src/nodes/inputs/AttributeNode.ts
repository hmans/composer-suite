import { nodeFactory } from "../../factories"
import { GLSLType } from "../../types"
import { variable } from "../../variables"

export const AttributeNode = nodeFactory<{ name: string; type: GLSLType }>(
  ({ name, type }) => ({
    varyings: {
      v_value: variable(type)
    },
    outputs: {
      value: variable(type)
    },
    vertex: {
      header: `attribute ${type} ${name};`,
      body: `value = v_value = ${name};`
    },
    fragment: {
      body: `value = v_value;`
    }
  })
)
