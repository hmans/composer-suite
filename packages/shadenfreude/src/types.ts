import { RenderCallback } from "@react-three/fiber"

export type GLSLType =
  | "bool"
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat4"
  | "sampler2D"

export type Operator = "*" | "/" | "+" | "-"

export type Qualifier = "uniform" | "varying" | "attribute"

export type Variable<T = any> = {
  _variable: true
  qualifier?: Qualifier
  value?: VariableValue<T>
  type: GLSLType
  name: string
}

export type VariableValue<T = any> = T | Variable<T> | ShaderNode<T>

export type Variables = Record<string, Variable>

export type Program = {
  header?: string
  body?: string
}

export type ShaderNode<T = any> = {
  name: string

  /* Header Variables */
  uniforms: Variables

  /* Programs */
  vertex: Program
  fragment: Program

  /* Variables */
  inputs: Variables
  outputs: Variables
  value: Variable<T>

  /* etc. */
  update?: RenderCallback
}

export function isVariable(value: any): value is Variable {
  return !!value._variable
}
