import { Chunk, ShaderModule } from "./types"

export function compileShader(...modules: ShaderModule[]) {
  const uniformsChunk = ""

  const vertexShader = /*glsl*/ `
${uniformsChunk}

${compileChunks(
  modules.map((m) => m.vertexHeader),
  false
)}

void main() {
  ${compileChunks(
    modules.map((m) => m.vertexMain),
    true
  )}
}
  `

  const fragmentShader = /*glsl*/ `
${uniformsChunk}

${compileChunks(
  modules.map((m) => m.fragmentHeader),
  false
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
  return chunks
    .map((chunk) =>
      wrap ? compileWrappedChunk(chunk) : compileBareChunk(chunk)
    )
    .join("\n")
}

function compileWrappedChunk(chunk: Chunk) {
  return /*glsl*/ `
  /* moo */
  {
    ${chunk}
  }`
}

function compileBareChunk(chunk: Chunk) {
  return /*glsl*/ `
  /* moo */
  ${chunk}`
}
