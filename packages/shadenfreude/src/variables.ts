import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { Expression } from "./expressions"
import { identifier, Part } from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"

/**
 * The different GLSL types we're supporting in variables.
 */
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

export type Value<T extends GLSLType = any> =
  | Expression
  | JSTypes[T]
  | Variable<T>

export type Chunk = Part | Part[]

export type VariableConfig<T extends GLSLType = any> = {
  id: number
  title: string
  name: string
  only?: "vertex" | "fragment"
  varying?: boolean
  vertexHeader?: Chunk
  vertexBody?: Chunk
  fragmentHeader?: Chunk
  fragmentBody?: Chunk
}

/**
 * Any object that extends the IVariable type can be a variable in the shader tree.
 * Variable objects are free to expose any additional properties on top of this.
 */
export interface IVariable<T extends GLSLType = any> {
  _: "Variable"
  _config: VariableConfig<T>
  type: T
  value: Value<T>
}

export type Variable<
  T extends GLSLType = any,
  API extends Record<string, any> = {}
> = IVariable<T> & API

const nextAnonymousId = idGenerator()

/**
 * Create a variable. Variables are the nodes the shader tree is composed of. Everything in the tree
 * is expressed as a variable.
 *
 * @param type GLSL type of the variable.
 * @param value Value of the variable. Can be a JS value, a reference to another variable, or a string expression.
 * @param configInput Optional configuration object.
 * @returns A freshly created variable, just for you
 */
export const Variable = <T extends GLSLType>(
  type: T,
  value: Value<T>,
  configInput: Partial<VariableConfig<T>> = {}
) => {
  const id = nextAnonymousId()

  const config: VariableConfig<T> = {
    /* Defaults */
    id,
    title: "anon",
    name: identifier("anonymous", id),

    /* User-provided configuration */
    ...configInput
  }

  const v: Variable<T> = {
    _: "Variable",
    _config: config,
    type,
    value
  }

  return v
}

export function isVariable(v: any): v is Variable {
  return v && v._ === "Variable"
}

/* Helpers */

const makeVariableHelper = <T extends GLSLType>(type: T) => (
  v: Value<T>,
  extras?: Partial<VariableConfig<T>>
) => Variable(type, v, extras)

export const Float = makeVariableHelper("float")
export const Bool = makeVariableHelper("bool")
export const Vec2 = makeVariableHelper("vec2")
export const Vec3 = makeVariableHelper("vec3")
export const Vec4 = makeVariableHelper("vec4")
export const Mat3 = makeVariableHelper("mat3")
export const Mat4 = makeVariableHelper("mat4")
