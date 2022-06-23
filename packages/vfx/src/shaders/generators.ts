import { Uniforms, Shader } from "./types"

export function createShader<U extends Uniforms = Uniforms>(
  input: Partial<Shader<U>>
): Shader<U> {
  return {
    uniforms: {} as U,
    varyings: {},
    attributes: {},
    config: {},
    vertexHeader: "",
    vertexMain: "",
    fragmentHeader: "",
    fragmentMain: "",
    ...input
  }
}
