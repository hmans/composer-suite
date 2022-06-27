import { float, nodeFactory, inferVariable } from "../../factories"
import { Value } from "../../types"

export const MixNode = nodeFactory<{
  a: Value
  b: Value
  factor: Value<"float">
}>(({ a, b, factor }) => {
  return {
    name: "Mix",
    inputs: {
      a: inferVariable(a),
      b: inferVariable(b),
      factor: float(factor)
    },
    outputs: {
      value: inferVariable(a)
    },
    vertex: {
      body: `value = mix(a, b, factor);`
    },
    fragment: {
      body: `value = mix(a, b, factor);`
    }
  }
})
