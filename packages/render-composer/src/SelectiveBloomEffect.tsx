import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import { useLayoutEffect } from "react"
import { usePostProcessingEffect } from "./lib/usePostProcessingEffect"

export const SelectiveBloomEffect = (
  props: ConstructorParameters<typeof PP.SelectiveBloomEffect>[2]
) => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  const effect = usePostProcessingEffect(
    () =>
      new PP.SelectiveBloomEffect(scene, camera, {
        blendFunction: PP.BlendFunction.ADD,
        mipmapBlur: true,
        luminanceThreshold: 1,
        luminanceSmoothing: 0.2,
        intensity: 1,
        ...props
      }),
    props
  )

  useLayoutEffect(() => {
    effect.inverted = true
  }, [effect])

  return null
}
