export type GLSLType =
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat4"
  | "sampler2D"
  | "samplerCube"
  | "bool"

export interface IVariable<T = any> {
  value?: T
  type: GLSLType
}

export type Variables = Record<string, IVariable>

export type VariableQualifier = "uniform" | "attribute" | "varying"

export type Uniform<T = any> = {
  value: T
  type: GLSLType
}

export type Attribute = {
  type: GLSLType
}

export type Varying<T = any> = {
  type: GLSLType
  value: T
}

export type Program = {
  header: string
  main: string
}

export type Shader = {
  uniforms: Record<string, Uniform>
  varyings: Record<string, Varying>
  vertexShader: Program
  fragmentShader: Program
}
