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
  inputs: Record<string, Value>
  vertexHeader?: string
  vertexBody?: string
  fragmentHeader?: string
  fragmentBody?: string
}

const nextAnonymousId = idGenerator()

export const variable = <T extends GLSLType>(
  type: T,
  value: Value<T>,
  extras: Partial<Variable<T>> = {}
): Variable<T> => ({
  name: identifier("anonymous", nextAnonymousId()),
  inputs: {},
  ...extras,
  _: "Variable",
  type,
  value
})

export function isVariable(v: any): v is Variable {
  return v && v._ === "Variable"
}

/* Helpers */

const makeVariableHelper = <T extends GLSLType>(type: T) => (
  v: Value<T>,
  extras?: Partial<Variable<T>>
) => variable(type, v, extras)

export const float = makeVariableHelper("float")
export const bool = makeVariableHelper("bool")
export const vec2 = makeVariableHelper("vec2")
export const vec3 = makeVariableHelper("vec3")
export const vec4 = makeVariableHelper("vec4")
export const mat3 = makeVariableHelper("mat3")
export const mat4 = makeVariableHelper("mat4")

export const glslType = <T extends GLSLType>(value: Value<T>): GLSLType => {
  if (isVariable(value)) return value.type

  if (typeof value === "number") return "float"

  if (value instanceof Color) return "vec3"

  if (value instanceof Vector3) return "vec3"

  /* Fail */
  throw new Error(`Could not render GLSL type for: ${value}`)
}
