import { Shader, Variables } from "."

export function createShader<U extends Variables = {}>(
  input: Partial<Shader<U>>
): Shader<U> {
  return {
    uniforms: {} as U,
    varyings: {},
    vertexHeader: "",
    vertexMain: "",
    fragmentHeader: "",
    fragmentMain: "",
    ...input
  }
}
