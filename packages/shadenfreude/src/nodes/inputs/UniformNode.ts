import { nodeFactory } from "../../factories"
import { GLSLType, Value } from "../../types"
import { variable } from "../../variables"

export const UniformNode = nodeFactory<{
  type: GLSLType
  name: string
  initialValue: Value
}>(({ type, name, initialValue }) => ({
  uniforms: {
    [name]: { ...variable(type, initialValue), name }
  },
  outputs: {
    value: variable(type, name)
  }
}))
