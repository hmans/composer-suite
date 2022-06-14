import { Chunk, ShaderConfig } from "./types"

export function compileShader(config: ShaderConfig) {
  const vertexShader = /*glsl*/ `
  ${compileChunks(config.vertexHeader || [], true)}

  void main() {
    ${compileChunks(config.vertexMain || [], true)}
  }
  `

  const fragmentShader = /*glsl*/ `
  ${compileChunks(config.fragmentHeader || [], true)}

  void main() {
    ${compileChunks(config.fragmentMain || [], true)}
  }
  `

  return { vertexShader, fragmentShader }
}

export function compileChunks(chunks: Chunk[], wrap = false) {
  return chunks.map((chunk) => compileChunk(chunk, wrap)).join("\n")
}

function compileChunk(chunk: Chunk, wrap = false) {
  return wrap ? `\n${chunk}\n` : chunk
}
