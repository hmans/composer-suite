import { node } from "../../factories"
import { GLSLType, Value } from "../../types"
import { variable } from "../../variables"

export type UniformNodeProps = {
  type: GLSLType
  name: string
  initialValue: Value
}

export const UniformNode = ({ type, name, initialValue }: UniformNodeProps) =>
  node({
    uniforms: {
      [name]: { ...variable(type, initialValue), name }
    },
    outputs: {
      value: variable(type, name)
    }
  })
