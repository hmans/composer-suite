import { Shader } from "."

export function createShader(input: Partial<Shader>): Shader {
  return {
    uniforms: {},
    varyings: {},
    vertexHeader: "",
    vertexMain: "",
    fragmentHeader: "",
    fragmentMain: "",
    ...input
  }
}
