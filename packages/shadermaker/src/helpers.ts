import { ShaderModule } from "./types"

export const makeShaderModule = (
  config: Partial<ShaderModule>
): ShaderModule => ({
  vertexHeader: "",
  vertexMain: "",
  fragmentHeader: "",
  fragmentMain: "",
  ...config
})
