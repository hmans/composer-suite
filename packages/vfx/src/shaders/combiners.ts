import { Shader, Variables } from "./types"

export function mutateShader(target: Shader, source: Shader) {
  Object.assign(target, addShaders(target, source))
}

export function addShaders<
  UniformsA extends Variables,
  UniformsB extends Variables
>(a: Shader<UniformsA>, b: Shader<UniformsB>): Shader<UniformsA & UniformsB> {
  return {
    uniforms: { ...a.uniforms, ...b.uniforms },
    varyings: { ...a.varyings, ...b.varyings },
    attributes: { ...a.attributes, ...b.attributes },
    configurator: { ...a.configurator, ...b.configurator },
    vertexHeader: a.vertexHeader + b.vertexHeader,
    vertexMain: a.vertexMain + b.vertexMain,
    fragmentHeader: a.fragmentHeader + b.fragmentHeader,
    fragmentMain: a.fragmentMain + b.fragmentMain,

    resetConfiguration: (...args) => {
      a.resetConfiguration?.(...args)
      b.resetConfiguration?.(...args)
    },

    applyConfiguration: (...args) => {
      a.applyConfiguration?.(...args)
      b.applyConfiguration?.(...args)
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
