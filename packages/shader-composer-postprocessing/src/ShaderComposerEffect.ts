import * as PP from "postprocessing"
import { compileShader } from "shader-composer"
import { PostProcessingEffectMaster } from "./PostProcessingEffectMaster"

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
