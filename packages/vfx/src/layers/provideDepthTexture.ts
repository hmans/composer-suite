import { DepthTexture } from "three"
import { createShader } from "../shaders"

export default function(depthTexture: DepthTexture) {
  return createShader({
    uniforms: { u_depth: { type: "sampler2D", value: depthTexture } }
  })
}
