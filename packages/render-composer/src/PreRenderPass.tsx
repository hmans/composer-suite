import { useThree } from "@react-three/fiber"
import { useContext, useMemo } from "react"
import { EffectComposerContext } from "./EffectComposer"
import { LayerRenderPass } from "./LayerRenderPass"
import { Layers } from "./Layers"

export const PreRenderPass = () => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  const pass = useMemo(
    () =>
      new LayerRenderPass(
        scene,
        camera,
        undefined,
        camera.layers.mask & ~(1 << Layers.TransparentFX)
      ),
    [scene, camera]
  )

  useContext(EffectComposerContext).useItem(pass)

  return null
}
