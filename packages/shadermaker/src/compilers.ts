import { Chunk, ShaderModule } from "./types"

export function compileShader(...modules: ShaderModule[]) {
  const uniformsChunk = ""

  const vertexHeaders = modules.map((m) => compileChunk(m.name, m.vertexHeader))
  const vertexMains = modules.map((m) =>
    compileWrappedChunk(m.name, m.vertexMain)
  )

  const fragmentHeaders = modules.map((m) =>
    compileChunk(m.name, m.fragmentHeader)
  )
  const fragmentMains = modules.map((m) =>
    compileWrappedChunk(m.name, m.fragmentMain)
  )

  const vertexShader = /*glsl*/ `
${uniformsChunk}

${vertexHeaders.join("\n")}

void main() {
  ${vertexMains.join("\n")}
}
  `

  const fragmentShader = /*glsl*/ `
${uniformsChunk}

${fragmentHeaders.join("\n")}

void main() {
  ${fragmentMains.join("\n")}
}
  `

  return { vertexShader, fragmentShader }
}

function compileChunk(name: string, chunk: Chunk) {
  return /*glsl*/ `
  /* ${name} */
  ${chunk}
  `
}

function compileWrappedChunk(name: string, chunk: Chunk) {
  return /*glsl*/ `
  /* ${name} */
  {
    ${chunk}
  }
  `
}
