import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import { useContext, useLayoutEffect, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export const SelectiveBloomEffect = () => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const effects = useContext(EffectPassContext)

  const effect = useMemo(
    () =>
      new PP.SelectiveBloomEffect(scene, camera, {
        blendFunction: PP.BlendFunction.ADD,
        mipmapBlur: true,
        luminanceThreshold: 1,
        luminanceSmoothing: 0.2,
        intensity: 2
      }),
    []
  )

  useLayoutEffect(() => {
    effect.inverted = true
  }, [effect])

  effects.useItem(effect)

  return null
}
