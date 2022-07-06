import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { identifier } from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"

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

export type Value<T extends GLSLType = any> = string | JSTypes[T] | Variable<T>

export type Variable<T extends GLSLType = any> = {
  _: "Variable"
  name: string
  type: T
  value: Value<T>
  dependencies: Variable[]
  vertexHeader?: string
  vertexBody?: string
  fragmentHeader?: string
  fragmentBody?: string
}

const nextAnonymousId = idGenerator()

export const variable = <T extends GLSLType>(
  type: T,
  value: Value<T>
): Variable<T> => ({
  _: "Variable",
  name: identifier("anonymous", nextAnonymousId()),
  type,
  value,
  dependencies: []
})

export function isVariable(v: any): v is Variable {
  return v && v._ === "Variable"
}

/* Helpers */
export const float = (v: Value<"float">) => variable("float", v)
export const vec2 = (v: Value<"vec2">) => variable("vec2", v)
export const vec3 = (v: Value<"vec3">) => variable("vec3", v)
export const vec4 = (v: Value<"vec4">) => variable("vec4", v)
