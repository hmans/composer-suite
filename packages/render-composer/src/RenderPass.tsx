import { useThree } from "@react-three/fiber"
import { RenderPass as RenderPassImpl } from "postprocessing"
import { useContext, useLayoutEffect } from "react"
import { EffectComposerContext } from "./EffectComposer"

export const RenderPass = () => {
  const passes = useContext(EffectComposerContext)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  useLayoutEffect(() => {
    const pass = new RenderPassImpl(scene, camera)

    passes.addItem(pass)
    passes.bumpVersion()

    return () => {
      passes.removeItem(pass)
      passes.bumpVersion()
    }
  }, [])

  return null
}
