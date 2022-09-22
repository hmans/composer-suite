import * as PP from "postprocessing"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export const VignetteEffect = (
  props: ConstructorParameters<typeof PP.VignetteEffect>[0]
) => {
  usePostProcessingEffect(() => new PP.VignetteEffect(props), props)
  return null
}
