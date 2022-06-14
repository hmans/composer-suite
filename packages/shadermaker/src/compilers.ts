import { Chunk, FrameCallback, ShaderModule, Uniforms, Varyings } from "./types"

export function compileShader(
  ...input: (ShaderModule | false | null | undefined)[]
) {
  const modules = input.filter((x) => !!x) as ShaderModule[]

  const uniforms = mergeUniforms(modules)
  const uniformsChunk = compileUniforms(modules)

  const attributesChunk = compileAttributeHeaders(modules)

  const varyingsChunk = compileVaryings(modules)
  const varyingAssignmentsChunk = compileVaryingAssignments(modules)

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

  /* VERTEX SHADER */
  const vertexShader = /*glsl*/ `
${uniformsChunk}
${attributesChunk}
${varyingsChunk}

${vertexHeaders.join("\n")}

void main() {
  ${varyingAssignmentsChunk}
  ${vertexMains.join("\n")}
}
  `

  /* FRAGMENT SHADER */
  const fragmentShader = /*glsl*/ `
${uniformsChunk}
${varyingsChunk}

${fragmentHeaders.join("\n")}

void main() {
  ${fragmentMains.join("\n")}
}
  `

  const callback: FrameCallback = (material, dt) => {
    for (const module of modules) {
      module.frameCallback?.(material, dt)
    }
  }

  return { vertexShader, fragmentShader, uniforms, callback }
}

function compileChunk(name: string, chunk: Chunk) {
  if (chunk === "") return ""

  return /*glsl*/ `
  /* ${name} */
  ${chunk}
  `
}

function compileWrappedChunk(name: string, chunk: Chunk) {
  if (chunk === "") return ""

  return /*glsl*/ `
  /* ${name} */
  {
    ${chunk}
  }
  `
}

function compileUniforms(modules: ShaderModule[]) {
  const parts = new Array<string>()
  parts.push("/* UNIFORMS */\n")

  modules.forEach((module) => {
    const names = Object.keys(module.uniforms)

    if (names.length > 0) {
      parts.push(`/* ${module.name} */`)

      names.forEach((name) => {
        const uniform = module.uniforms[name]
        parts.push(`uniform ${uniform.type} ${name};`)
      })
    }
  })

  return parts.join("\n")
}

function compileAttributeHeaders(modules: ShaderModule[]) {
  const parts = new Array<string>()
  parts.push("/* ATTRIBUTES */\n")

  modules.forEach((module) => {
    const names = Object.keys(module.attributes)

    if (names.length > 0) {
      parts.push(`/* ${module.name} */`)

      names.forEach((name) => {
        const attribute = module.attributes[name]
        parts.push(`attribute ${attribute.type} ${name};`)
      })
    }
  })

  return parts.join("\n")
}

function compileVaryings(modules: ShaderModule[]) {
  const parts = new Array<string>()
  parts.push("/* VARYINGS */\n")

  modules.forEach((module) => {
    const names = Object.keys(module.varyings)

    if (names.length > 0) {
      parts.push(`/* ${module.name} */`)

      names.forEach((name) => {
        const varying = module.varyings[name]
        parts.push(`varying ${varying.type} ${name};`)
      })
    }
  })

  return parts.join("\n")
}

function compileVaryingAssignments(modules: ShaderModule[]) {
  const parts = new Array<string>()
  parts.push("/* VARYING ASSIGNMENTS */\n")

  modules.forEach((module) => {
    const names = Object.keys(module.varyings)

    if (names.length > 0) {
      parts.push(`/* ${module.name} */`)

      names.forEach((name) => {
        const varying = module.varyings[name]
        if (varying.value !== undefined) {
          parts.push(`${name} = ${varying.value};`)
        }
      })
    }
  })

  return parts.join("\n")
}

function mergeUniforms(modules: ShaderModule[]): Uniforms {
  return modules.reduce((acc, module) => {
    return { ...acc, ...module.uniforms }
  }, {})
}
