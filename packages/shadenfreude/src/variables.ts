import { glslType } from "./helpers"
import {
  GLSLType,
  isShaderNode,
  isVariable,
  ShaderNode,
  Value,
  Variable
} from "./types"

export const variablesToNodes = new Map<Variable, ShaderNode>()

export function variable<T extends GLSLType>(
  type: T,
  value?: Value<T>
): Variable<T> {
  /* By default, we'll give the variable a random name. */
  const name = `var_${type}_${Math.floor(Math.random() * 100000)}`

  return {
    _variable: true,
    name,
    type,
    value
  }
}

export const float = (value?: Value<"float">) => variable("float", value)

export const bool = (value?: Value<"bool">) => variable("bool", value)

export const vec2 = (value?: Value<"vec2">) => variable("vec2", value)

export const vec3 = (value?: Value<"vec3">) => variable("vec3", value)

export const vec4 = (value?: Value<"vec4">) => variable("vec4", value)

export const mat3 = (value?: Value<"mat3">) => variable("mat3", value)

export const mat4 = (value?: Value<"mat4">) => variable("mat4", value)

/**
 * Creates a new variable with the GLSL type inferred from the specified value.
 */
export function inferVariable(a: Value): Variable {
  if (isVariable(a)) {
    return variable(a.type, a)
  } else if (isShaderNode(a)) {
    if (a.outputs.value === undefined) {
      throw new Error("No value output on node")
    } else {
      return inferVariable(a.outputs.value)
    }
  } else {
    return variable(glslType(a), a)
  }
}
