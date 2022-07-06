import { Color, Vector3 } from "three"
import { GLSLType, Value, isVariable } from "./variables"

export const glslType = <T extends GLSLType>(value: Value<T>): T => {
  if (isVariable(value)) return value.type

  if (typeof value === "number") return "float" as T

  if (value instanceof Color) return "vec3" as T

  if (value instanceof Vector3) return "vec3" as T

  /* Fail */
  throw new Error(`Could not render GLSL type for: ${value}`)
}

export const type = glslType
