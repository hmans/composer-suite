import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { GLSLType, isShaderNode, isVariable, Value } from "./types"

export function glslType(value: Value): GLSLType {
  if (isVariable(value)) {
    return value.type
  } else if (isShaderNode(value)) {
    return glslType(value.value)
  } else if (typeof value === "number") {
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
