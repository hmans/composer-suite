import { useFrame, useThree } from "@react-three/fiber"
import { useMemo } from "react"
import { DepthFormat, DepthTexture, FloatType } from "three"
import { useFBO } from "./useFBO"

export function useDepthBuffer() {
  const dpr = useThree((state) => state.viewport.dpr)
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const w = width * dpr
  const h = height * dpr
  console.log(w, h)

  const depthTexture = useMemo(() => {
    const depthTexture = new DepthTexture(w, h)
    depthTexture.format = DepthFormat
    depthTexture.type = FloatType

    return depthTexture
  }, [w, h])

  const depthFBO = useFBO(w, h, { depthTexture })

  useFrame((state) => {
    state.gl.setRenderTarget(depthFBO)
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
  })

  return depthFBO.depthTexture
}
