import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { GLSLType, isUnit, Input } from "./units"

export const glslType = <T extends GLSLType>(value: Input<T>): T => {
  if (isUnit(value)) return value._unitConfig.type

  if (typeof value === "number") return "float" as T
  if (value instanceof Vector4) return "vec4" as T
  if (value instanceof Vector3) return "vec3" as T
  if (value instanceof Vector2) return "vec2" as T
  if (value instanceof Matrix3) return "mat3" as T
  if (value instanceof Matrix4) return "mat4" as T
  if (value instanceof Color) return "vec3" as T

  /* Fail */
  throw new Error(`Could not render GLSL type for: ${value}`)
}

export const type = glslType
