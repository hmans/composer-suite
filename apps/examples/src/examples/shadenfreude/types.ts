import { RenderCallback } from "@react-three/fiber"

export type GLSLType = "float" | "vec2" | "vec3" | "vec4" | "mat4"

export type Qualifier = "uniform" | "varying" | "attribute"

export type Variable<T = any> = {
  _variable: true
  qualifier?: Qualifier
  value?: T
  type: GLSLType
  name: string
}

export type Variables = Record<string, Variable>

export type ShaderNode = {
  name: string

  /* Header Variables */
  uniforms: Variables

  /* Programs */
  vertex: {
    header: string
    body: string
  }
  fragment: {
    header: string
    body: string
  }

  /* Variables */
  inputs: Variables
  outputs: Variables

  /* etc. */
  update?: RenderCallback
}
