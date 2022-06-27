import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { node, nodeFactory, variable } from "../factories"
import {
  GLSLType,
  isShaderNode,
  isVariable,
  Operator,
  Value,
  Variable
} from "../types"

function lookupGLSLType(value: any): GLSLType {
  if (typeof value === "number") {
    return "float"
  } else if (typeof value === "boolean") {
    return "bool"
  } else if (value instanceof Color) {
    return "vec3"
  } else if (value instanceof Vector2) {
    return "vec2"
  } else if (value instanceof Vector3) {
    return "vec3"
  } else if (value instanceof Vector4) {
    return "vec4"
  } else if (value instanceof Matrix3) {
    return "mat3"
  } else if (value instanceof Matrix4) {
    return "mat4"
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
  a: Value
  b: Value
  factor: Value<"float">
}>(({ a, b, factor }) => {
  const A = wrapVariable(a)
  const B = wrapVariable(b)

  return {
    name: "Mix",
    inputs: {
      a: A,
      b: B,
      factor: wrapVariable(factor)
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
