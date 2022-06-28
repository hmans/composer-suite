import { node } from "../../factories"
import { GLSLType, Value, Variable } from "../../types"
import { variable } from "../../variables"

export type VaryingNodeProps = { type: GLSLType; source: Value }

export const VaryingNode = <T extends GLSLType>(props: VaryingNodeProps) =>
  node<T>({
    name: "Varying",
    varyings: {
      v_value: variable(props.type)
    },
    inputs: {
      source: variable(props.type)
    },
    outputs: {
      value: variable(props.type) as Variable<T>
    },
    vertex: {
      body: `value = v_value = ${props.source};`
    },
    fragment: {
      body: "value = v_value;"
    }
  })
