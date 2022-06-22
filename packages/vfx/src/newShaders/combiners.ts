import { Shader, Variables } from "./types"

export function addShaders<UniformsA, UniformsB>(
  a: Shader<UniformsA>,
  b: Shader<UniformsB>
): Shader<UniformsA & UniformsB> {
  return {
    uniforms: { ...a.uniforms, ...b.uniforms },
    varyings: { ...a.varyings, ...b.varyings },
    vertexHeader: a.vertexHeader + b.vertexHeader,
    vertexMain: a.vertexMain + b.vertexMain,
    fragmentHeader: a.fragmentHeader + b.fragmentHeader,
    fragmentMain: a.fragmentMain + b.fragmentMain,

    update: (...args) => {
      a.update?.(...args)
      b.update?.(...args)
    }
  }
}

export function combineShaders(shaders: Shader[]) {
  return shaders.reduce(addShaders)
}
