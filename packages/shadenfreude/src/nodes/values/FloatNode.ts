import { float, nodeFactory, Value } from "../.."

export const FloatNode = nodeFactory<{ value: Value<"float"> }>(
  ({ value }) => ({
    name: "Constant Float Value",
    outputs: {
      value: float(value)
    }
  })
)
