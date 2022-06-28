import { node } from "../../factories"
import { Value } from "../../types"
import { inferVariable, float } from "../../variables"

export type MixNodeProps = {
  a: Value
  b: Value
  factor: Value<"float">
}

export const MixNode = ({ a, b, factor }: MixNodeProps) =>
  node({
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
  })
