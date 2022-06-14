import { Chunk, ShaderModule } from "./types"

export function compileShader(...modules: ShaderModule[]) {
  const vertexShader = /*glsl*/ `
  ${compileChunks(
    modules.map((m) => m.vertexHeader),
    true
  )}

  void main() {
    ${compileChunks(
      modules.map((m) => m.vertexMain),
      true
    )}
  }
  `

  const fragmentShader = /*glsl*/ `
  ${compileChunks(
    modules.map((m) => m.fragmentHeader),
    true
  )}

  void main() {
    ${compileChunks(
      modules.map((m) => m.fragmentMain),
      true
    )}
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
