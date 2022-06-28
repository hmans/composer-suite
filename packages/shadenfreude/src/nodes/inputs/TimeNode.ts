import { node, nodeFactory } from "../../factories"
import { Value } from "../../types"
import { float } from "../../variables"

export const TimeNode = nodeFactory<{ source: Value<"float"> }>(
  ({ source }) => {
    return node({
      name: "Time Uniform",
      inputs: {
        time: float(source)
      },
      outputs: {
        value: float("time"),
        sinTime: float("sin(time)"),
        cosTime: float("sin(time)")
      }
    })
  }
)
