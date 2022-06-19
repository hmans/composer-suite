import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { render } from "react-dom"
import { DepthFormat, DepthTexture, FloatType, WebGLRenderTarget } from "three"
import { useFBO } from "./useFBO"

export function useDepthBuffer(resolution = 128) {
  const renderTarget = useMemo(() => {
    const renderTarget = new WebGLRenderTarget(resolution, resolution)

    renderTarget.depthTexture = new DepthTexture(resolution, resolution)
    // renderTarget.depthTexture.format = DepthFormat
    // renderTarget.depthTexture.type = FloatType

    console.log("Created RenderTarget:", renderTarget)

    return renderTarget
  }, [resolution])

  useFrame((state) => {
    state.gl.setRenderTarget(renderTarget)
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
  })

  return renderTarget.depthTexture
}
