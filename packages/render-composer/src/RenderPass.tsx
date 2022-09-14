import { useThree } from "@react-three/fiber"
import { RenderPass as RenderPassImpl } from "postprocessing"
import { useContext, useMemo } from "react"
import { EffectComposerContext } from "./EffectComposer"

export const RenderPass = () => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  const pass = useMemo(() => new RenderPassImpl(scene, camera), [scene, camera])

  const { useItem } = useContext(EffectComposerContext)
  useItem(pass)

  return null
}
