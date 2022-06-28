import { node } from "../../factories"
import { GLSLType, Value } from "../../types"
import { variable } from "../../variables"

export type VaryingNodeProps = { type: GLSLType; source: Value }

export const VaryingNode = (props: VaryingNodeProps) =>
  node({
    name: "Varying",
    varyings: {
      v_value: variable(props.type)
    },
    inputs: {
      source: variable(props.type)
    },
    outputs: {
      value: variable(props.type)
    },
    vertex: {
      body: `value = v_value = ${props.source};`
    },
    fragment: {
      body: "value = v_value;"
    }
  })
