import { Shader } from "./types"

export function combineShaders(a: Shader, b: Shader): Shader {
  return {
    uniforms: { ...a.uniforms, ...b.uniforms },

    varyings: { ...a.varyings, ...b.varyings },

    vertexHeader: a.vertexHeader + b.vertexHeader,
    vertexMain: a.vertexMain + b.vertexMain,

    fragmentHeader: a.fragmentHeader + b.fragmentHeader,
    fragmentMain: a.fragmentMain + b.fragmentMain
  }
}
