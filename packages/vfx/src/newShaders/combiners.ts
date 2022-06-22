import { Shader, Variables } from "./types"

export function addShaders<
  UniformsA extends Variables,
  UniformsB extends Variables
>(a: Shader<UniformsA>, b: Shader<UniformsB>): Shader<UniformsA & UniformsB> {
  return {
    uniforms: { ...a.uniforms, ...b.uniforms },
    varyings: { ...a.varyings, ...b.varyings },
    attributes: { ...a.attributes, ...b.attributes },
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

/* TODO: properly type this */
export function combineShaders(shaders: Shader[]) {
  return shaders.reduce(addShaders)
}
