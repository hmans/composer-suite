import { ShaderModule } from "./types"

export const makeShaderModule = (
  config: Partial<ShaderModule>
): ShaderModule => ({
  name: "unnamed",
  uniforms: {},
  vertexHeader: "",
  vertexMain: "",
  fragmentHeader: "",
  fragmentMain: "",
  ...config
})
