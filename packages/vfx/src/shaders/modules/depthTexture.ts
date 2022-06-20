import { DepthTexture } from "three"
import { module } from ".."

export default function(depthTexture: DepthTexture) {
  const uniforms = {
    u_depth: { value: depthTexture }
  }

  return module({
    uniforms,
    vertexHeader: `uniform sampler2D u_depth;`,
    fragmentHeader: `uniform sampler2D u_depth;`
  })
}
