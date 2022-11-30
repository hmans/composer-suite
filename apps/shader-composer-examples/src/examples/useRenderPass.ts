import { useFrame, useThree } from "@react-three/fiber"
import { useLayoutEffect, useMemo, useRef } from "react"
import { DepthTexture, WebGLRenderTarget } from "three"
import { useUniformUnit } from "shader-composer-r3f"

export type RenderPassOptions = {
  resolution?: number
  excludeLayer?: number
}

export const useRenderPass = ({
  resolution = 0.5,
  excludeLayer
}: RenderPassOptions = {}) => {
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)
  const size = useThree((s) => s.size)
  const dpr = useThree((s) => s.viewport.dpr)

  const renderTargets = useMemo(
    () => [
      new WebGLRenderTarget(256, 256, {
        depthTexture: new DepthTexture(256, 256)
      }),
      new WebGLRenderTarget(256, 256, {
        depthTexture: new DepthTexture(256, 256)
      })
    ],
    []
  )

  const texture = useUniformUnit("sampler2D", renderTargets[0].texture)
  const depthTexture = useUniformUnit(
    "sampler2D",
    renderTargets[0].depthTexture
  )
  const cursor = useRef(0)

  useLayoutEffect(() => {
    return () => {
      renderTargets[0].dispose()
      renderTargets[1].dispose()
    }
  }, [])

  useLayoutEffect(() => {
    const width = size.width * dpr * resolution
    const height = size.height * dpr * resolution
    renderTargets[0].setSize(width, height)
    renderTargets[1].setSize(width, height)
  }, [resolution, renderTargets, size, dpr])

  useFrame(() => {
    const renderTarget = renderTargets[cursor.current]

    /* If a layer was given, disable it for rendering */
    if (excludeLayer !== undefined) camera.layers.disable(excludeLayer)

    /* Render depth texture */
    gl.setRenderTarget(renderTarget)
    gl.clear()
    gl.render(scene, camera)
    gl.setRenderTarget(null)

    /* If a layer was given, re-enable it again */
    if (excludeLayer !== undefined) camera.layers.enable(excludeLayer)

    /* Assign uniforms */
    texture.value = renderTarget.texture
    depthTexture.value = renderTarget.depthTexture

    /* Cycle render targets */
    cursor.current = (cursor.current + 1) % 2
  })

  return { texture, depthTexture }
}
