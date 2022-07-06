import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"

export const foo = "bar"

export type GLSLType =
  | "bool"
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4"

export type JSTypes = {
  bool: boolean
  float: number
  vec2: Vector2
  vec3: Vector3 | Color
  vec4: Vector4
  mat3: Matrix3
  mat4: Matrix4
}

export type Value<T extends GLSLType = any> = T extends undefined
  ? never
  : JSTypes[T] | Variable<T>

export type Variable<T extends GLSLType = any> = {
  type?: T
  value?: Value<T>
}

export const variable = <T extends GLSLType>(
  type?: T,
  value?: Value<T>
): Variable<T> => ({
  type,
  value
})
