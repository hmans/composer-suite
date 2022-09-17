import * as PP from "postprocessing"
import {
  $,
  compileShader,
  Float,
  Input,
  Mul,
  PostProcessingEffectMaster,
  Smoothstep,
  Texture2D,
  UniformUnit,
  Vec2,
  Vec3
} from "shader-composer"
import { Texture } from "three"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export type LensDirtEffectProps = ConstructorParameters<
  typeof LensDirtEffectImpl
>[0]

export const LensDirtEffect = (props: LensDirtEffectProps) => {
  usePostProcessingEffect(() => new LensDirtEffectImpl(props), props)
  return null
}

export type ShaderComposerEffectProps = {
  root: ReturnType<typeof PostProcessingEffectMaster>
  blendFunction?: PP.BlendFunction
}

export class ShaderComposerEffect extends PP.Effect {
  constructor({
    root,
    blendFunction = PP.BlendFunction.NORMAL
  }: ShaderComposerEffectProps) {
    const [shader] = compileShader(root)

    /* TODO: replace this hack with something nicer. Maybe we can teach `compileShader` the signature of the function it should emit? */
    const fragment = shader.fragmentShader.replace(
      "void main()",
      "void mainImage(const in vec4 inputColorRGBA, const in vec2 uv, out vec4 outputColorRGBA)"
    )

    super("LensDirt", fragment, {
      blendFunction,
      uniforms: new Map(Object.entries(shader.uniforms))
    })
  }
}

const InputColor = Vec3($`inputColorRGBA.rgb`)
const InputAlpha = Vec3($`inputColorRGBA.a`)
const UV = Vec2($`uv`)
const Luminance = (color: Input<"vec3">) => Float($`luminance(${color})`)

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
