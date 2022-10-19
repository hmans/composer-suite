import * as PP from "postprocessing"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export const TiltShiftEffect = (
  props: ConstructorParameters<typeof PP.TiltShiftEffect>[0]
) => {
  usePostProcessingEffect(() => new PP.TiltShiftEffect(props), props)
  return null
}
