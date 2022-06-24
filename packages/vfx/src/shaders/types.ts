import { RenderCallback } from "@react-three/fiber"
import { MeshParticles } from "../MeshParticles/useMeshParticles"

export type GLSLType =
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4"
  | "sampler2D"
  | "samplerCube"
  | "bool"

export type GLSLChunk = string

export type VariableQualifier = "uniform" | "attribute" | "varying"

export type Uniform<T = any> = { type: GLSLType; value: T }
export type Uniforms = Record<string, Uniform>

export type Varying<T = any> = { type: GLSLType }
export type Varyings = Record<string, Varying>

export type Attribute<T = any> = { type: GLSLType }
export type Attributes = Record<string, Attribute>

export type UpdateCallback = RenderCallback

export type Shader<U = Uniforms, V = Varyings, A = Attributes> = {
  uniforms: U
  varyings: V
  attributes: A
  vertexHeader: GLSLChunk
  vertexMain: GLSLChunk
  fragmentHeader: GLSLChunk
  fragmentMain: GLSLChunk

  config: Record<string, any>
  resetConfig?: (mesh: MeshParticles) => void
  applyConfig?: (mesh: MeshParticles, index: number) => void
  update?: RenderCallback
}
