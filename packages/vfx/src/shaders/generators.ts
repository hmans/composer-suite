import { Shader, Variables } from "."

export function createShader<Uniforms extends Variables = {}>(
  input: Partial<Shader<Uniforms>>
): Shader<Uniforms> {
  return {
    uniforms: {} as Uniforms,
    varyings: {},
    attributes: {},
    configurator: {},
    vertexHeader: "",
    vertexMain: "",
    fragmentHeader: "",
    fragmentMain: "",
    ...input
  }
}
