import { node, nodeFactory, variable } from "../factories"
import { isShaderNode, Operator, ShaderNode, Value, Variable } from "../types"

export const OperatorNode = nodeFactory<{
  operator: Operator
  a: Variable | ShaderNode
  b: Variable | ShaderNode
}>(({ a, b, operator }) => {
  const A = isShaderNode(a) ? a.value : a
  const B = isShaderNode(b) ? b.value : b

  return node({
    name: `Perform ${operator} on ${A.type}`,
    inputs: {
      a: variable(A.type, A),
      b: variable(B.type, B)
    },
    outputs: {
      value: variable(A.type)
    },
    vertex: {
      body: `value = a ${operator} b;`
    },
    fragment: {
      body: `value = a ${operator} b;`
    }
  })
})

export const AddNode = nodeFactory<{
  a: Variable | ShaderNode
  b: Variable | ShaderNode
}>(({ a, b }) => OperatorNode({ operator: "+", a, b }))

export const MultiplyNode = nodeFactory<{
  a: Variable | ShaderNode
  b: Variable | ShaderNode
}>(({ a, b }) => OperatorNode({ operator: "*", a, b }))

/* TODO: change this to accept Value args, not Variable! */
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
