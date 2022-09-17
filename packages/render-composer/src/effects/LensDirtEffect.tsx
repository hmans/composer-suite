import * as PP from "postprocessing"
import {
  $,
  compileShader,
  Mul,
  PostProcessingEffectMaster
} from "shader-composer"
import { Color } from "three"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export type LensDirtEffectProps = ConstructorParameters<
  typeof PP.NoiseEffect
>[0] & { opacity?: number }

export const LensDirtEffect = ({
  blendFunction = PP.BlendFunction.NORMAL,
  premultiply,
  opacity = 1
}: LensDirtEffectProps) => {
  usePostProcessingEffect(() => new LensDirtEffectImpl(), {
    blendMode: new PP.BlendMode(blendFunction, opacity)
  })
  return null
}

export class ShaderComposerEffect extends PP.Effect {
  constructor(root: ReturnType<typeof PostProcessingEffectMaster>) {
    const [shader] = compileShader(root)

    const fragment = shader.fragmentShader.replace(
      "void main()\n{",
      "void mainImage(const in vec4 inputColorRGBA, const in vec2 uv, out vec4 outputColorRGBA)\n{ vec3 inputColor = inputColorRGBA.rgb; float inputAlpha = inputColorRGBA.a;"
    )

    super("LensDirt", fragment, {
      blendFunction: PP.BlendFunction.NORMAL
      // uniforms: new Map(shader.uniforms)
    })
  }
}

export class LensDirtEffectImpl extends ShaderComposerEffect {
  constructor() {
    super(
      PostProcessingEffectMaster({
        color: Mul(new Color("hotpink"), $`inputColor`)
      })
    )
  }
}
