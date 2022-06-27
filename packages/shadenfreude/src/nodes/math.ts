import { node, nodeFactory, variable } from "../factories"
import { isShaderNode, Operator, ShaderNode, Value, Variable } from "../types"

/* TODO: naming... oof */
type VariableArgument = Variable | ShaderNode

function resolveVariableArgument(a: VariableArgument) {
  return isShaderNode(a) ? a.value : a
}

export const OperatorNode = nodeFactory<{
  operator: Operator
  a: VariableArgument
  b: VariableArgument
}>(({ a, b, operator }) => {
  const A = resolveVariableArgument(a)
  const B = resolveVariableArgument(b)

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
  a: VariableArgument
  b: VariableArgument
}>(({ a, b }) => OperatorNode({ operator: "+", a, b }))

export const MultiplyNode = nodeFactory<{
  a: VariableArgument
  b: VariableArgument
}>(({ a, b }) => OperatorNode({ operator: "*", a, b }))

/* TODO: change this to accept Value args, not Variable! */
export const MixNode = nodeFactory<{
  a: VariableArgument
  b: VariableArgument
  factor: Value<"float">
}>(({ a, b, factor }) => {
  const A = resolveVariableArgument(a)
  const B = resolveVariableArgument(b)

  return {
    name: "Mix",
    inputs: {
      a: variable(A.type, A),
      b: variable(B.type, B),
      factor: variable("float", factor)
    },
    outputs: {
      value: variable(A.type)
    },
    vertex: {
      body: `value = mix(a, b, factor);`
    },
    fragment: {
      body: `value = mix(a, b, factor);`
    }
  }
})
