import * as PP from "postprocessing"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export const TextureEffect = (
  props: ConstructorParameters<typeof PP.TextureEffect>[0]
) => {
  usePostProcessingEffect(() => new PP.TextureEffect(props), props)
  return null
}
