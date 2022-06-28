import { nodeFactory, Value, vec3, float } from "../.."

export const Vector3Node = nodeFactory<{ value: Value<"vec3"> }>(
  ({ value }) => ({
    name: "Constant Vector3 Value",
    outputs: {
      value: vec3(value),
      x: float("value.x"),
      y: float("value.y"),
      z: float("value.z")
    }
  })
)
