import { node } from "../../factories"
import { Value } from "../../types"
import { float, vec3 } from "../../variables"

export type Vector3NodeProps = { value: Value<"vec3"> }

export const Vector3Node = (props: Vector3NodeProps) =>
  node({
    name: "Constant Vector3 Value",
    inputs: {
      vector: vec3(props.value)
    },
    outputs: {
      value: vec3("vector"),
      x: float("vector.x"),
      y: float("vector.y"),
      z: float("vector.z")
    }
  })
