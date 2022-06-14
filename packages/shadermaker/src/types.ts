export type Chunk = string

export type ShaderModule = {
  vertexHeader: Chunk
  vertexMain: Chunk
  fragmentHeader: Chunk
  fragmentMain: Chunk
}
