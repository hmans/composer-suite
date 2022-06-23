import { Shader, Uniforms, Variables } from "./types"

export function mutateShader(target: Shader, source: Shader) {
  Object.assign(target, addShaders(target, source))
}

export function addShaders<
  UniformsA extends Uniforms,
  UniformsB extends Uniforms
>(a: Shader<UniformsA>, b: Shader<UniformsB>): Shader<UniformsA & UniformsB> {
  return {
    uniforms: { ...a.uniforms, ...b.uniforms },
    varyings: { ...a.varyings, ...b.varyings },
    attributes: { ...a.attributes, ...b.attributes },
    config: { ...a.config, ...b.config },
    vertexHeader: a.vertexHeader + b.vertexHeader,
    vertexMain: a.vertexMain + b.vertexMain,
    fragmentHeader: a.fragmentHeader + b.fragmentHeader,
    fragmentMain: a.fragmentMain + b.fragmentMain,

    resetConfig: (...args) => {
      a.resetConfig?.(...args)
      b.resetConfig?.(...args)
    },

    applyConfig: (...args) => {
      a.applyConfig?.(...args)
      b.applyConfig?.(...args)
    },

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
