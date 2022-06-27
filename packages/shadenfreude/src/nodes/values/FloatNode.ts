import { nodeFactory, float } from "../../factories"
import { Value } from "../../types"

export const FloatNode = nodeFactory<{ value: Value<"float"> }>(
  ({ value }) => ({
    name: "Constant Float Value",
    outputs: {
      value: float(value)
    }
  })
)
