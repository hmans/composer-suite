import * as PP from "postprocessing"
import {
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

export class LensDirtEffectImpl extends ShaderComposerEffect {
  constructor({
    texture,
    blendFunction = PP.BlendFunction.ADD
  }: {
    texture: Texture
    blendFunction?: PP.BlendFunction
  }) {
    const u_texture = UniformUnit("sampler2D", texture)

    super({
      blendFunction,
      root: PostProcessingEffectMaster({
        color: Mul(
          Texture2D(u_texture, UV).color,
          Smoothstep(0.1, 0.3, Luminance(InputColor))
        )
      })
    })
  }
}
