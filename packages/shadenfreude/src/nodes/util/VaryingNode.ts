import { nodeFactory } from "../../factories"
import { GLSLType, Value } from "../../types"
import { variable } from "../../variables"

export const VaryingNode = nodeFactory<{ type: GLSLType; source: Value }>(
  ({ type, source }) => ({
    name: "Varying",
    varyings: {
      v_value: variable(type)
    },
    inputs: {
      source: variable(type)
    },
    outputs: {
      value: variable(type)
    },
    vertex: {
      body: `value = v_value = ${source};`
    },
    fragment: {
      body: "value = v_value;"
    }
  })
)
