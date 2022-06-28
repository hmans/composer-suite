import { nodeFactory } from "../../factories"
import { GLSLType } from "../../types"
import { variable } from "../../variables"

export const UniformNode = nodeFactory<{ type: GLSLType; name: string }>(
  ({ type, name }) => ({
    outputs: {
      value: variable(type, name)
    },
    vertex: {
      header: `uniform ${type} ${name};`
    },
    fragment: {
      header: `uniform ${type} ${name};`
    }
  })
)
