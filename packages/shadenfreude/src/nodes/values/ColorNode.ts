import { node } from "../../factories"
import { Value } from "../../types"
import { vec3 } from "../../variables"

export type ColorNodeProps = { color: Value<"vec3"> }

export const ColorNode = (props: ColorNodeProps) =>
  node({
    name: "Constant Color Value",
    outputs: {
      value: vec3(props.color)
    }
  })
