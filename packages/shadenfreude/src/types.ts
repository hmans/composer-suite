import { RenderCallback, Vector2, Vector3, Vector4 } from "@react-three/fiber"
import { Color, Matrix3, Matrix4, Texture } from "three"

export type GLSLType =
  | "bool"
  | "int"
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4"
  | "sampler2D"

export type JSType = number | boolean | Vector2 | Vector3 | Vector4 | Color

/** Maps GLSL types to JS types. */
export type GLSLtoJSType<T extends GLSLType> = T extends "bool"
  ? boolean
  : T extends "float"
  ? number
  : T extends "int"
  ? number
  : T extends "vec2"
  ? Vector2
  : T extends "vec3"
  ? Vector3 | Color
  : T extends "vec4"
  ? Vector4
  : T extends "mat3"
  ? Matrix3
  : T extends "mat4"
  ? Matrix4
  : T extends "sampler2D"
  ? Texture
  : never

export type Operator = "*" | "/" | "+" | "-"

export type Qualifier = "uniform" | "varying" | "attribute"

export type Variable<T extends GLSLType = any> = {
  _variable: true
  qualifier?: Qualifier
  value?: Value<T>
  type: T
  name: string
}

export type Value<T extends GLSLType = any> =
  | GLSLtoJSType<T>
  | Variable<T>
  | ShaderNode<T>
  | string

export type Variables = Record<string, Variable>

export type Program = {
  header?: string
  body?: string
}

export type ShaderNode<T extends GLSLType = any> = {
  _shaderNode: true

  /** Human-readable name */
  name: string

  /** Machine-readable, snake_case prefix  */
  prefix?: string

  /* Header Variables */
  uniforms: Variables
  varyings: Variables

  /* Programs */
  vertex: Program
  fragment: Program

  /* Variables */
  inputs: Variables
  outputs: Variables & T extends GLSLType ? { value: Variable<T> } : {}

  /* etc. */
  update?: RenderCallback
}

export function isVariable(value: any): value is Variable {
  return !!value?._variable
}

export function isShaderNode(value: any): value is ShaderNode {
  return !!value?._shaderNode
}
