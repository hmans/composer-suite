import { node } from "../../factories"
import { Value } from "../../types"
import { vec3, float } from "../../variables"

export type Vector3NodeProps = { value: Value<"vec3"> }

export const Vector3Node = (props: Vector3NodeProps) =>
  node({
    name: "Constant Vector3 Value",
    outputs: {
      value: vec3(props.value),
      x: float("value.x"),
      y: float("value.y"),
      z: float("value.z")
    }
  })
