import { GLSLType, isUnit, Input } from "./units"

export type GLSLTypeFor<JSType> = JSType extends number
  ? "float"
  : JSType extends boolean
  ? "bool"
  : JSType extends { isTexture: any }
  ? "sampler2D"
  : JSType extends { x: number; y: number }
  ? "vec2"
  : JSType extends { x: number; y: number; z: number }
  ? "vec3"
  : JSType extends { x: number; y: number; z: number; w: number }
  ? "vec4"
  : JSType extends { r: number; g: number; b: number }
  ? "vec3"
  : JSType extends [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ]
  ? "mat3"
  : JSType extends [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ]
  ? "mat4"
  : never

export const glslType = <T extends GLSLType>(value: Input<T>): T => {
  if (isUnit(value)) return value._unitConfig.type

  if (typeof value === "number") return "float" as T
  if (isObjectWithKeys(value, "x", "y", "z", "w")) return "vec4" as T
  if (isObjectWithKeys(value, "r", "g", "b")) return "vec3" as T
  if (isObjectWithKeys(value, "x", "y", "z")) return "vec3" as T
  if (isObjectWithKeys(value, "x", "y")) return "vec2" as T
  if (isArrayWithLength(value, 9)) return "mat3" as T
  if (isArrayWithLength(value, 16)) return "mat4" as T

  /* Fail */
  throw new Error(`Could not render GLSL type for: ${value}`)
}

function isArrayWithLength(obj: any, length: number) {
  return Array.isArray(obj) && obj.length === length
}

function isObjectWithKeys(obj: any, ...keys: string[]) {
  return keys.every((key) => obj.hasOwnProperty(key))
}

export const type = glslType
