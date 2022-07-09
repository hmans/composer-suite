import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { glslRepresentation } from "./glslRepresentation"
import { type } from "./glslType"
import { identifier, Part } from "./lib/concatenator3000"
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

export type Chunk = Part | Part[]

export type VariableConfig<T extends GLSLType = any> = {
  id: number
  title: string
  name: string
  inputs: Record<string, Value>
  only?: "vertex" | "fragment"
  varying?: boolean
  vertexHeader?: Chunk
  vertexBody?: Chunk
  fragmentHeader?: Chunk
  fragmentBody?: Chunk
}

export type Variable<T extends GLSLType = any> = {
  _: "Variable"
  _config: VariableConfig<T>
  type: T
  value: Value<T>
}

type Api = Record<string, any>
type ApiFactory<T extends GLSLType, A extends Api> = (
  variable: Variable<T>
) => A

const nextAnonymousId = idGenerator()

export const Variable = <T extends GLSLType, A extends Api = {}>(
  type: T,
  value: Value<T>,
  configInput: Partial<VariableConfig<T>> = {},
  apiFactory?: ApiFactory<T, A>
) => {
  const id = nextAnonymousId()

  const config: VariableConfig<T> = {
    /* Defaults */
    id,
    title: `Anonymous ${type} = ${glslRepresentation(value)}`,
    name: identifier("anonymous", id),
    inputs: {},

    /* User-provided configuration */
    ...configInput
  }

  const v: Variable<T> = {
    _: "Variable",
    _config: config,
    type,
    value
  }

  return injectAPI(v, (apiFactory ? apiFactory(v) : {}) as A)
}

const injectAPI = <V extends Variable, A extends Api>(variable: V, api: A) => {
  return { ...variable, ...api }
}

export function isVariable(v: any): v is Variable {
  return v && v._ === "Variable"
}

export function isType<T extends GLSLType>(v: any, t: T): v is Value<T> {
  return type(v) === t
}

/* Helpers */

const makeVariableHelper = <T extends GLSLType, A extends Api>(
  type: T,
  apiFactory?: ApiFactory<T, A>
) => (v: Value<T>, config?: Partial<VariableConfig<T>>) =>
  Variable(type, v, config, apiFactory)

const vec2Api = (v: Variable) => ({
  get x() {
    return Float("v.x", { inputs: { v } })
  },
  get y() {
    return Float("v.y", { inputs: { v } })
  }
})

const vec3Api = (v: Variable) => ({
  ...vec2Api(v),
  get z() {
    return Float("v.z", { inputs: { v } })
  }
})

const vec4Api = (v: Variable) => ({
  ...vec3Api(v),
  get w() {
    return Float("v.w", { inputs: { v } })
  }
})

export const Float = makeVariableHelper("float")
export const Bool = makeVariableHelper("bool")
export const Vec2 = makeVariableHelper("vec2", vec2Api)
export const Vec3 = makeVariableHelper("vec3", vec3Api)
export const Vec4 = makeVariableHelper("vec4", vec4Api)
export const Mat3 = makeVariableHelper("mat3")
export const Mat4 = makeVariableHelper("mat4")

export type Float = Value<"float">
export type Bool = Value<"bool">
export type Vec2 = Value<"vec2">
export type Vec3 = Value<"vec3">
export type Vec4 = Value<"vec4">
export type Mat3 = Value<"mat3">
export type Mat4 = Value<"mat4">
