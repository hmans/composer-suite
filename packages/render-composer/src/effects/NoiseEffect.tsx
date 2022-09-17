import * as PP from "postprocessing"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export type NoiseEffectProps = ConstructorParameters<
  typeof PP.NoiseEffect
>[0] & { opacity?: number }

export const NoiseEffect = ({
  blendFunction = PP.BlendFunction.NORMAL,
  premultiply,
  opacity = 1
}: NoiseEffectProps) => {
  usePostProcessingEffect(
    () => new PP.NoiseEffect({ blendFunction, premultiply }),
    { blendMode: new PP.BlendMode(blendFunction, opacity) }
  )
  return null
}
