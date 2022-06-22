import { Shader } from "./types"

export function combine(a: Shader, b: Shader): Shader {
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

export function combineShaders(...shaders: Shader[]) {
  return shaders.reduce(combine)
}
