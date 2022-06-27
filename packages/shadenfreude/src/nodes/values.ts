import { Color } from "three"
import { nodeFactory, vec3, float } from "../factories"
import { Value } from "../types"

export const ColorNode = nodeFactory<{ color?: Value<"vec3"> }>(
  ({ color = new Color(1.0, 1.0, 1.0) }) => ({
    name: "Constant Color Value",
    outputs: {
      value: vec3(color)
    }
  })
)

export const FloatNode = nodeFactory<{ value: Value<"float"> }>(
  ({ value }) => ({
    name: "Constant Float Value",
    outputs: {
      value: float(value)
    }
  })
)
