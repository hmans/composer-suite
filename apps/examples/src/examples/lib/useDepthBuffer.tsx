import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { DepthTexture, WebGLRenderTarget } from "three"

export function useDepthBuffer(resolution = 128) {
  const renderTarget = useMemo(() => {
    return new WebGLRenderTarget(resolution, resolution, {
      depthTexture: new DepthTexture(resolution, resolution)
    })
  }, [resolution])

  useFrame((state) => {
    state.gl.setRenderTarget(renderTarget)
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
  })

  return renderTarget.depthTexture
}
