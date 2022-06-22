import { DepthTexture } from "three"
import { createShader } from "../newShaders"

export default function(depthTexture: DepthTexture) {
  return createShader({
    uniforms: { u_depth: { type: "sampler2D", value: depthTexture } }
  })
}
