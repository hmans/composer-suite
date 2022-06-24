export type GLSLType = "float" | "vec2" | "vec3" | "vec4" | "mat4"

export type Variable<T = any> = {
  value?: T
  type: GLSLType
  globalName: string
}

export type Variables = Record<string, Variable>

export type ShaderNode = {
  name: string
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
}
