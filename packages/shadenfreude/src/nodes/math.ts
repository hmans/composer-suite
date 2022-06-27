import { Color, Vector2, Vector3, Vector4 } from "three"
import { node, nodeFactory, variable } from "../factories"
import {
  GLSLType,
  isShaderNode,
  isVariable,
  Operator,
  ShaderNode,
  Value,
  Variable
} from "../types"

/* TODO: naming... oof */
type VariableArgument = Variable | ShaderNode

function lookupGLSLType(value: any): GLSLType {
  if (typeof value === "number") {
    return "float"
  } else if (value instanceof Color) {
    return "vec3"
  } else if (value instanceof Vector2) {
    return "vec2"
  } else if (value instanceof Vector3) {
    return "vec3"
  } else if (value instanceof Vector4) {
    return "vec4"
  } else {
    throw new Error(`Could not find a GLSL type for: ${value}`)
  }
}

function wrapVariable(a: Value): Variable {
  if (isVariable(a)) {
    return variable(a.type, a)
  } else if (isShaderNode(a)) {
    return wrapVariable(a.value)
  } else {
    return variable(lookupGLSLType(a), a)
  }
}

function resolveVariableArgument(a: VariableArgument) {
  return isShaderNode(a) ? a.value : a
}

export const OperatorNode = nodeFactory<{
  operator: Operator
  a: Value
  b: Value
}>(({ a, b, operator }) => {
  const A = wrapVariable(a)
  const B = wrapVariable(b)

  return node({
    name: `Perform ${operator} on ${A.type}`,
    inputs: {
      a: A,
      b: B
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
  a: Value
  b: Value
}>(({ a, b }) => OperatorNode({ operator: "+", a, b }))

export const MultiplyNode = nodeFactory<{
  a: Value
  b: Value
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
