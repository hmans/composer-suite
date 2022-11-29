import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { isExpression } from "./expressions"
import { isArrayWithLength, isObjectWithKeys } from "./glslType"
import { isSnippet } from "./snippets"
import { GLSLType, Input, isUnit, uniformName } from "./units"

export const glslRepresentation = (
  value: Input | undefined,
  typeHint?: GLSLType
): string => {
  if (value === undefined) return ""

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

  if (isObjectWithKeys(value, "isMatrix3"))
    return `mat3(${value
      .toArray()
      .map((n: Input) => g(n))
      .join(", ")})`

  if (isObjectWithKeys(value, "isMatrix4"))
    return `mat4(${value
      .toArray()
      .map((n: Input) => g(n))
      .join(", ")})`

  if (isArrayWithLength(value, 4))
    return `vec4(${g(value[0])}, ${g(value[1])}, ${g(value[2])}, ${g(
      value[3]
    )})`

  if (isObjectWithKeys(value, "x", "y", "z", "w"))
    return `vec4(${g(value.x)}, ${g(value.y)}, ${g(value.z)}, ${g(value.w)})`

  if (isObjectWithKeys(value, "x", "y", "z"))
    return `vec3(${g(value.x)}, ${g(value.y)}, ${g(value.z)})`

  if (isArrayWithLength(value, 3))
    return `vec3(${g(value[0])}, ${g(value[1])}, ${g(value[2])})`

  if (isObjectWithKeys(value, "r", "g", "b"))
    return `vec3(${g(value.r)}, ${g(value.g)}, ${g(value.b)})`

  if (isArrayWithLength(value, 2)) return `vec2(${g(value[0])}, ${g(value[1])})`

  if (isObjectWithKeys(value, "x", "y"))
    return `vec2(${g(value.x)}, ${g(value.y)})`

  // if (Array.isArray(value))
  //   return value.map((v) => glslRepresentation(v)).join(", ")

  /* Fail */
  throw new Error(`Could not render value to GLSL: ${JSON.stringify(value)}`)
}

const g = glslRepresentation
