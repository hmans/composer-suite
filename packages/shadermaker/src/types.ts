export type Chunk = string

export type ShaderConfig = {
  vertexHeader?: Chunk[]
  vertexMain?: Chunk[]
  fragmentHeader?: Chunk[]
  fragmentMain?: Chunk[]
}
