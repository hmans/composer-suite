import * as PP from "postprocessing"
import {
  $,
  Add,
  compileShader,
  Float,
  Input,
  Mix,
  Mul,
  PostProcessingEffectMaster,
  Smoothstep,
  Texture2D,
  UniformUnit,
  Vec2,
  Vec3
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

const InputColor = Vec3($`inputColor`)
const UV = Vec2($`uv`)
const Luminance = (color: Input<"vec3">) => Float($`luminance(${color})`)

export class LensDirtEffectImpl extends ShaderComposerEffect {
  constructor(opts: { texture: Texture }) {
    const u_texture = UniformUnit("sampler2D", opts.texture)

    super(
      PostProcessingEffectMaster({
        color: Add(
          InputColor,
          Mul(
            Texture2D(u_texture, UV).color,
            Smoothstep(0.1, 0.5, Luminance(InputColor))
          )
        )
      })
    )
  }
}
