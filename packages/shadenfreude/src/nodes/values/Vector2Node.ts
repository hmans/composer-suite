import { node } from "../../factories"
import { Value } from "../../types"
import { float, vec2 } from "../../variables"

export type Vector2NodeProps = { value: Value<"vec2"> }

export const Vector2Node = (props: Vector2NodeProps) =>
  node({
    name: "Constant Vector2 Value",
    inputs: {
      vector: vec2(props.value)
    },
    outputs: {
      value: vec2("vector"),
      x: float("vector.x"),
      y: float("vector.y")
    }
  })
