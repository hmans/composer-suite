import { pipe } from "fp-ts/function"
import * as PP from "postprocessing"
import {
  InputColor,
  PostProcessingEffectMaster,
  ShaderComposerEffect
} from "shader-composer-postprocessing"
import { Color } from "three"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export type TiltShiftEffectProps = ConstructorParameters<
  typeof TiltShiftEffectImpl
>[0]

export const TiltShiftEffect = (props: TiltShiftEffectProps) => {
  usePostProcessingEffect(() => new TiltShiftEffectImpl(props), props)
  return null
}

export type TiltShiftEffectArgs = {
  blendFunction?: PP.BlendFunction
}

export class TiltShiftEffectImpl extends ShaderComposerEffect {
  constructor({
    blendFunction = PP.BlendFunction.NORMAL
  }: TiltShiftEffectArgs) {
    super({
      blendFunction,
      root: PostProcessingEffectMaster({
        color: pipe(InputColor, (v) => new Color("red"))
      })
    })
  }
}
