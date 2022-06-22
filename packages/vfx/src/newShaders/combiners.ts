import { Shader } from "./types"

export function combineShaders(a: Shader, b: Shader): Shader {
  return {
    uniforms: { ...a.uniforms, ...b.uniforms },

    varyings: { ...a.varyings, ...b.varyings },

    vertexShader: {
      header: `${a.vertexShader.header} ${b.vertexShader.header}`,
      main: `${a.vertexShader.main} ${b.vertexShader.main}`
    },

    fragmentShader: {
      header: `${a.fragmentShader.header} ${b.fragmentShader.header}`,
      main: `${a.fragmentShader.main} ${b.fragmentShader.main}`
    }
  }
}
