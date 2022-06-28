import { nodeFactory, Value, vec3 } from "../.."

export const Vector3Node = nodeFactory<{ value: Value<"vec3"> }>(
  ({ value }) => ({
    name: "Constant Vector3 Value",
    outputs: {
      value: vec3(value)
    }
  })
)
