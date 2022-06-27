import { float, node, nodeFactory, wrapVariable } from "../factories"
import { glslType } from "../helpers"
import { Operator, Value } from "../types"

export const OperatorNode = nodeFactory<{
  operator: Operator
  a: Value
  b: Value
}>(({ a, b, operator }) =>
  node({
    name: `Perform ${operator} on ${glslType(a)}`,
    inputs: {
      a: wrapVariable(a),
      b: wrapVariable(b)
    },
    outputs: {
      value: wrapVariable(a)
    },
    vertex: {
      body: `value = a ${operator} b;`
    },
    fragment: {
      body: `value = a ${operator} b;`
    }
  })
)

export const AddNode = nodeFactory<{
  a: Value
  b: Value
}>(({ a, b }) => OperatorNode({ operator: "+", a, b }))

export const MultiplyNode = nodeFactory<{
  a: Value
  b: Value
}>(({ a, b }) => OperatorNode({ operator: "*", a, b }))

/* TODO: change this to accept Value args, not Variable! */
export const MixNode = nodeFactory<{
  a: Value
  b: Value
  factor: Value<"float">
}>(({ a, b, factor }) => {
  return {
    name: "Mix",
    inputs: {
      a: wrapVariable(a),
      b: wrapVariable(b),
      factor: float(factor)
    },
    outputs: {
      value: wrapVariable(a)
    },
    vertex: {
      body: `value = mix(a, b, factor);`
    },
    fragment: {
      body: `value = mix(a, b, factor);`
    }
  }
})
