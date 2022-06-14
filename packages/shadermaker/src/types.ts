export type Chunk = {
  header: string
  main: string
}

export type ShaderConfig = {
  vertex: Chunk
  fragment: Chunk
}
