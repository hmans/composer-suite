import { Shader, Variables } from "./types"

export function combine<UA extends Variables, UB extends Variables>(
  a: Shader<UA>,
  b: Shader<UB>
): Shader<UA & UB> {
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

export function combineShaders(...shaders: Shader<unknown>[]) {
  return shaders.reduce(combine)
}
