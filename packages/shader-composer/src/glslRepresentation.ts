import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { isExpression } from "./expressions"
import { isSnippet } from "./snippets"
import { GLSLType, isUnit, Input, uniformName } from "./units"

export const glslRepresentation = (
  value: Input | undefined,
  typeHint?: GLSLType
): string => {
  if (value === undefined) return ""

  if (Array.isArray(value)) {
    return value.map((v) => glslRepresentation(v)).join(", ")
  }

  if (isUnit(value))
    return value._unitConfig.uniform
      ? uniformName(value)
      : value._unitConfig.variableName

  if (isExpression(value)) return value.render()

  if (isSnippet(value)) return value.name

  if (typeof value === "string") return value

  if (typeof value === "boolean") return value ? "true" : "false"

  if (typeof value === "number") {
    const s = value.toString()
    return typeHint === "int" ? s : s.match(/[.e]/) ? s : `${s}.0`
  }

  if (value instanceof Color)
    return `vec3(${g(value.r)}, ${g(value.g)}, ${g(value.b)})`

  if (value instanceof Vector2) return `vec2(${g(value.x)}, ${g(value.y)})`

  if (value instanceof Vector3)
    return `vec3(${g(value.x)}, ${g(value.y)}, ${g(value.z)})`

  if (value instanceof Vector4)
    return `vec4(${g(value.x)}, ${g(value.y)}, ${g(value.z)}, ${g(value.w)})`

  if (value instanceof Matrix3)
    return `mat3(${value
      .toArray()
      .map((n) => g(n))
      .join(", ")})`

  if (value instanceof Matrix4)
    return `mat4(${value
      .toArray()
      .map((n) => g(n))
      .join(", ")})`

  /* Fail */
  throw new Error(`Could not render value to GLSL: ${JSON.stringify(value)}`)
}

const g = glslRepresentation
