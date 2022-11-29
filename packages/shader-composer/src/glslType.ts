import { GLSLType, Input, isUnit } from "./units"

export type Vector2 =
  | { x: Input<"float">; y: Input<"float"> }
  | [Input<"float">, Input<"float">]

export type Vector3 =
  | { x: Input<"float">; y: Input<"float">; z: Input<"float"> }
  | [Input<"float">, Input<"float">, Input<"float">]

export type Vector4 = {
  x: Input<"float">
  y: Input<"float">
  z: Input<"float">
  w: Input<"float">
}

export type Color = { r: Input<"float">; g: Input<"float">; b: Input<"float"> }

export type Matrix2 = [
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">
]

export type Matrix3 = [
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">
]

export type Matrix4 = [
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">,
  Input<"float">
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
  if (isUnit(value)) return value._unitConfig.type as T

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

export function isArrayWithLength(obj: any, length: number) {
  return (
    (obj instanceof Float32Array || Array.isArray(obj)) && obj.length === length
  )
}

export function isObjectWithKeys(obj: any, ...keys: string[]) {
  return keys.every((key) => obj[key] !== undefined)
}
