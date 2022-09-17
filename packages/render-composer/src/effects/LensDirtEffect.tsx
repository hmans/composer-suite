import * as PP from "postprocessing"
import {
  $,
  compileShader,
  Mix,
  Mul,
  PostProcessingEffectMaster,
  Texture2D,
  UniformUnit,
  UV
} from "shader-composer"
import { Color, Texture, TextureLoader } from "three"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export type LensDirtEffectProps = ConstructorParameters<
  typeof LensDirtEffectImpl
>[0]

export const LensDirtEffect = (props: LensDirtEffectProps) => {
  usePostProcessingEffect(() => new LensDirtEffectImpl(props), props)
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
      blendFunction: PP.BlendFunction.NORMAL,
      uniforms: new Map(Object.entries(shader.uniforms))
    })
  }
}

export class LensDirtEffectImpl extends ShaderComposerEffect {
  constructor({ texture }: { texture: Texture }) {
    const u_texture = UniformUnit("sampler2D", texture)

    super(
      PostProcessingEffectMaster({
        color: Mix(Texture2D(u_texture, $`uv`).color, $`inputColor`, 0.5)
      })
    )
  }
}
