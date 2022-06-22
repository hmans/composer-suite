import { Shader, Variables } from "."

export function createShader<Uniforms extends Variables = {}>(
  input: Partial<Shader<Uniforms>>
): Shader<Uniforms> {
  return {
    uniforms: {} as Uniforms,
    varyings: {},
    attributes: {},
    vertexHeader: "",
    vertexMain: "",
    fragmentHeader: "",
    fragmentMain: "",
    ...input
  }
}
