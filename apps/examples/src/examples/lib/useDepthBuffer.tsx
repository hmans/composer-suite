import { useFrame, useThree } from "@react-three/fiber"
import { useMemo } from "react"
import { DepthTexture, WebGLRenderTarget } from "three"

export function useDepthBuffer(resolution = 0.1) {
  /* Fetch some items we need from the R3F state. */
  const size = useThree((s) => s.size)
  const dpr = useThree((s) => s.viewport.dpr)

  const renderTarget = useMemo(() => {
    /* Calculate render target dimensions */
    const textureWidth = size.width * dpr * resolution
    const textureHeight = size.width * dpr * resolution

    /* Create depth texture */
    const depthTexture = new DepthTexture(textureWidth, textureHeight)

    /* Create render target using the depth texture */
    return new WebGLRenderTarget(textureWidth, textureHeight, { depthTexture })
  }, [resolution, size.width, size.height, dpr])

  /* Every frame, render to our render target so we get a fresh depth texture. */
  useFrame((state) => {
    state.gl.setRenderTarget(renderTarget)
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
  })

  return renderTarget
}
