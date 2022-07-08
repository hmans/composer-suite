import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { glslRepresentation } from "./glslRepresentation"
import { type } from "./glslType"
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
  id: number
  title: string
  name: string
  type: T
  value: Value<T>
  inputs: Record<string, Value>
  only?: "vertex" | "fragment"
  varying?: boolean
  vertexHeader?: string
  vertexBody?: string
  fragmentHeader?: string
  fragmentBody?: string
}

const nextAnonymousId = idGenerator()

export const Variable = <T extends GLSLType>(
  type: T,
  value: Value<T>,
  extras: Partial<Variable<T>> = {}
) => {
  const id = nextAnonymousId()

  const v: Variable<T> = {
    id,
    title: `Anonymous ${type} = ${glslRepresentation(value)}`,
    name: identifier("anonymous", id),
    inputs: {},
    ...extras,
    _: "Variable",
    type,
    value
  }

  return v
}

export function isVariable(v: any): v is Variable {
  return v && v._ === "Variable"
}

export function isType<T extends GLSLType>(v: any, t: T): v is Value<T> {
  return type(v) === t
}

/* Helpers */

const makeVariableHelper = <T extends GLSLType>(type: T) => (
  v: Value<T>,
  extras?: Partial<Variable<T>>
) => Variable(type, v, extras)

export const Float = makeVariableHelper("float")
export const Bool = makeVariableHelper("bool")
export const Vec2 = makeVariableHelper("vec2")
export const Vec3 = makeVariableHelper("vec3")
export const Vec4 = makeVariableHelper("vec4")
export const Mat3 = makeVariableHelper("mat3")
export const Mat4 = makeVariableHelper("mat4")

export type Float = Value<"float">
export type Bool = Value<"bool">
export type Vec2 = Value<"vec2">
export type Vec3 = Value<"vec3">
export type Vec4 = Value<"vec4">
export type Mat3 = Value<"mat3">
export type Mat4 = Value<"mat4">
