import { Color } from "three"
import { nodeFactory, Value, vec3 } from "../.."

export const ColorNode = nodeFactory<{ color?: Value<"vec3"> }>(
  ({ color = new Color(1.0, 1.0, 1.0) }) => ({
    name: "Constant Color Value",
    outputs: {
      value: vec3(color)
    }
  })
)
