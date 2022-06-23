import { RenderCallback } from "@react-three/fiber"
import { MeshParticles } from "../MeshParticles/useMeshParticles"

export type GLSLType =
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat4"
  | "sampler2D"
  | "samplerCube"
  | "bool"

export type GLSLChunk = string

export type Variable<T = any> = {
  value?: T
  type: GLSLType
}

export type Variables = Record<string, Variable>

export type VariableQualifier = "uniform" | "attribute" | "varying"

export type Uniform<T = any> = Variable<T>

export type Varying<T = any> = Variable<T>

export type Attribute<T = any> = Variable<T> & {
  itemSize: number
}

export type UpdateCallback = RenderCallback

export type Shader<
  U extends Variables = Record<string, Uniform>,
  V extends Variables = Record<string, Varying>,
  A extends Variables = Record<string, Attribute>
> = {
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
