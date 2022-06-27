import { Shader } from "three-vfx"
import { node, variable, nodeFactory } from "../factories"
import { Operator, Variable, Value, ShaderNode, isShaderNode } from "../types"

export const OperatorNode = (
  operator: Operator,
  inputs: { a: Variable | ShaderNode; b: Variable | ShaderNode }
) => {
  const A = isShaderNode(inputs.a) ? inputs.a.value : inputs.a
  const B = isShaderNode(inputs.b) ? inputs.b.value : inputs.b

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
}

export const AddNode = nodeFactory<{
  a: Variable | ShaderNode
  b: Variable | ShaderNode
}>(({ a, b }) => OperatorNode("+", { a, b }))

export const MultiplyNode = nodeFactory<{
  a: Variable | ShaderNode
  b: Variable | ShaderNode
}>(({ a, b }) => OperatorNode("*", { a, b }))

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
