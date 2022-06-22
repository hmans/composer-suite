import { Shader, Variables } from "./types"

export function combineShaders<
  UniformsA extends Variables,
  UniformsB extends Variables
>(
  a: Shader<UniformsA>,
  b: Shader<UniformsB>,
  ...rest: Shader<any>[]
): Shader<UniformsA & UniformsB> {
  const ab: Shader<UniformsA & UniformsB> = {
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

  if (!rest.length) return ab

  const [c, ...remaining] = rest
  return combineShaders(ab, c, ...remaining)
}
