import { ShaderModule } from "./types"

export const makeShaderModule = (
  config: Partial<ShaderModule>
): ShaderModule => ({
  name: "unnamed",
  uniforms: {},
  attributes: {},
  varyings: {},
  vertexHeader: "",
  vertexMain: "",
  fragmentHeader: "",
  fragmentMain: "",
  ...config
})

export const float = (v: number | string) =>
  typeof v === "number" ? v.toFixed(5) : v
