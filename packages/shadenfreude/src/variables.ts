import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { identifier } from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"

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

export type Chunk = string | string[]

export type Program = {
  header?: Chunk
  body?: Chunk
}

export type Variable<T extends GLSLType = any> = {
  name: string
  type?: T
  value?: Value<T>
  vertex?: Program
  fragment?: Program
}

const nextAnonymousId = idGenerator()

export const variable = <T extends GLSLType>(
  type?: T,
  value?: Value<T>
): Variable<T> => ({
  name: identifier("anonymous", nextAnonymousId()),
  type,
  value
})
