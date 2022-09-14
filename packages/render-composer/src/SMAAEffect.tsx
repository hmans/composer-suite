import * as PP from "postprocessing"
import { usePostProcessingEffect } from "./lib/usePostProcessingEffect"

export const SMAAEffect = (
  props: ConstructorParameters<typeof PP.SMAAEffect>[0]
) => {
  usePostProcessingEffect(() => new PP.SMAAEffect(props), props)
  return null
}
