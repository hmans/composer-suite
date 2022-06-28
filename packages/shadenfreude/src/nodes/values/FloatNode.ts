import { node } from "../../factories"
import { Value } from "../../types"
import { float } from "../../variables"

export type FloatNodeProps = {
  value: Value<"float">
}

export function FloatNode(props: FloatNodeProps) {
  return node({
    name: "Constant Float Value",
    outputs: {
      value: float(props.value)
    }
  })
}
