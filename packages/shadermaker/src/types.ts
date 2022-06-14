export type Chunk = string

export type GLSLType = "float" | "vec2" | "vec3" | "vec4" | "mat4"

export type Uniform = {
  type: GLSLType
  value: any
}

export type ShaderModule = {
  name: string
  uniforms: { [key: string]: Uniform }
  vertexHeader: Chunk
  vertexMain: Chunk
  fragmentHeader: Chunk
  fragmentMain: Chunk
}
