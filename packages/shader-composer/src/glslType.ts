import { GLSLType, isUnit, Input } from "./units"

export type Vector2 = { x: number; y: number }
export type Vector3 = { x: number; y: number; z: number }
export type Vector4 = { x: number; y: number; z: number; w: number }
export type Color = { r: number; g: number; b: number }
export type Matrix2 = [number, number, number, number]
export type Matrix3 = [
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
export type Matrix4 = [
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
  number,
  number,
  number,
  number,
  number
]

export type GLSLTypeFor<JSType> = JSType extends number
  ? "float"
  : JSType extends boolean
  ? "bool"
  : JSType extends { isTexture: any }
  ? "sampler2D"
  : JSType extends Vector2
  ? "vec2"
  : JSType extends Vector3
  ? "vec3"
  : JSType extends Vector4
  ? "vec4"
  : JSType extends Color
  ? "vec3"
  : JSType extends Matrix2
  ? "mat2"
  : JSType extends Matrix3
  ? "mat3"
  : JSType extends Matrix4
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

export const type = glslType

function isArrayWithLength(obj: any, length: number) {
  return Array.isArray(obj) && obj.length === length
}

function isObjectWithKeys(obj: any, ...keys: string[]) {
  return keys.every((key) => obj.hasOwnProperty(key))
}
