import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import { useContext, useLayoutEffect, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export type SelectiveBloomEffectProps = PP.BloomEffectOptions

export const SelectiveBloomEffect = (props: SelectiveBloomEffectProps) => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  const effect = useMemo(
    () =>
      new PP.SelectiveBloomEffect(scene, camera, {
        blendFunction: PP.BlendFunction.ADD,
        mipmapBlur: true,
        luminanceThreshold: 1,
        luminanceSmoothing: 0.2,
        intensity: 1
      }),
    []
  )

  useLayoutEffect(() => {
    Object.assign(effect, props)
  }, [effect, props])

  useLayoutEffect(() => {
    effect.inverted = true
  }, [effect])

  useContext(EffectPassContext).useItem(effect)

  return null
}
