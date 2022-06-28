import { nodeFactory, vec3 } from "../../factories"
import { Value } from "../../types"

export const Vector3Node = nodeFactory<{ value: Value<"vec3"> }>(
  ({ value }) => ({
    name: "Constant Vector3 Value",
    outputs: {
      value: vec3(value)
    }
  })
)
