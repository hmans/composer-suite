import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { DepthTexture, WebGLRenderTarget } from "three"

export function useDepthBuffer(resolution = 256) {
  const renderTarget = useMemo(() => {
    const depthTexture = new DepthTexture(resolution, resolution)
    return new WebGLRenderTarget(resolution, resolution, { depthTexture })
  }, [resolution])

  useFrame((state) => {
    state.gl.setRenderTarget(renderTarget)
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
  })

  return renderTarget.depthTexture
}
