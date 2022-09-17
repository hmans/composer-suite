import { pipe } from "fp-ts/function"
import * as PP from "postprocessing"
import {
  Input,
  Luminance,
  Mul,
  Smoothstep,
  Texture2D,
  UniformUnit
} from "shader-composer"
import {
  InputColor,
  PostProcessingEffectMaster,
  ShaderComposerEffect,
  UV
} from "shader-composer-postprocessing"
import { Texture } from "three"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export type LensDirtEffectProps = ConstructorParameters<
  typeof LensDirtEffectImpl
>[0]

export const LensDirtEffect = (props: LensDirtEffectProps) => {
  usePostProcessingEffect(() => new LensDirtEffectImpl(props), props)
  return null
}

export type LensDirtEffectArgs = {
  texture: Texture
  blendFunction?: PP.BlendFunction
  minLuminance?: Input<"float">
  maxLuminance?: Input<"float">
  strength?: Input<"float">
}

export class LensDirtEffectImpl extends ShaderComposerEffect {
  constructor({
    texture,
    blendFunction = PP.BlendFunction.ADD,
    minLuminance = 0.1,
    maxLuminance = 0.3,
    strength = 1
  }: LensDirtEffectArgs) {
    const u_texture = UniformUnit("sampler2D", texture)

    super({
      blendFunction,
      root: PostProcessingEffectMaster({
        color: pipe(
          InputColor,
          (v) => Luminance(v),
          (v) => Smoothstep(minLuminance, maxLuminance, v),
          (v) => Mul(v, strength),
          (v) => Mul(Texture2D(u_texture, UV).color, v)
        )
      })
    })
  }
}
