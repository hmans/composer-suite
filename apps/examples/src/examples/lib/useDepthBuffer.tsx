import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useMemo } from "react"
import { DepthTexture, WebGLRenderTarget } from "three"

export function useDepthBuffer(resolution = 0.5) {
  /* Fetch some items we need from the R3F state. */
  const size = useThree((s) => s.size)
  const dpr = useThree((s) => s.viewport.dpr)

  const renderTarget = useMemo(() => {
    /* Create render target using the depth texture */
    return new WebGLRenderTarget(256, 256, {
      depthTexture: new DepthTexture(256, 256)
    })
  }, [])

  /* Update rendertarget dimensions when the viewport changes */
  useLayoutEffect(() => {
    /* Calculate render target dimensions */
    const textureWidth = size.width * dpr * resolution
    const textureHeight = size.height * dpr * resolution

    renderTarget.setSize(textureWidth, textureHeight)
  }, [renderTarget, resolution, size.width, size.height, dpr])

  /* Dispose of render target at unmount */
  useEffect(() => () => renderTarget.dispose(), [])

  /* Every frame, render to our render target so we get a fresh depth texture. */
  useFrame((state) => {
    state.gl.setRenderTarget(renderTarget)
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
  })

  return renderTarget
}
