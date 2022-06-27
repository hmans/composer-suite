import { node, variable, nodeFactory } from "../factories"
import { Operator, Variable, Value } from "../types"

export const OperatorNode = (
  operator: Operator,
  inputs: { a: Variable; b: Variable }
) =>
  node({
    name: `Perform ${operator} on ${inputs.a.type}`,
    inputs: {
      a: variable(inputs.a.type, inputs.a),
      b: variable(inputs.b.type, inputs.b)
    },
    outputs: {
      value: variable(inputs.a.type)
    },
    vertex: {
      body: `value = a ${operator} b;`
    },
    fragment: {
      body: `value = a ${operator} b;`
    }
  })

export const AddNode = nodeFactory<{ a: Variable; b: Variable }>(({ a, b }) =>
  OperatorNode("+", { a, b })
)

export const MultiplyNode = nodeFactory<{ a: Variable; b: Variable }>(
  ({ a, b }) => OperatorNode("*", { a, b })
)

export const MixNode = nodeFactory<{
  a: Variable
  b: Variable
  factor: Value<"float">
}>(({ a, b, factor }) => ({
  name: "Mix",
  inputs: {
    a: variable(a.type, a),
    b: variable(b.type, b),
    factor: variable("float", factor)
  },
  outputs: {
    value: variable(a.type)
  },
  vertex: {
    body: `value = mix(a, b, factor);`
  },
  fragment: {
    body: `value = mix(a, b, factor);`
  }
}))
