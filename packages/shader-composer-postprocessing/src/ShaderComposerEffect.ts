import * as PP from "postprocessing"
import { compileShader } from "@shader-composer/core"
import { WebGLRenderer, WebGLRenderTarget } from "three"
import { PostProcessingEffectMaster } from "./PostProcessingEffectMaster"

export type ShaderComposerEffectProps = {
  root: ReturnType<typeof PostProcessingEffectMaster>
  blendFunction?: PP.BlendFunction
}

export class ShaderComposerEffect extends PP.Effect {
  private _shaderMeta: ReturnType<typeof compileShader>[1]

  constructor({
    root,
    blendFunction = PP.BlendFunction.NORMAL
  }: ShaderComposerEffectProps) {
    const [shader, meta] = compileShader(root)

    /* TODO: replace this hack with something nicer. Maybe we can teach `compileShader` the signature of the function it should emit? */
    const fragment = shader.fragmentShader.replace(
      "void main()",
      "void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)"
    )

    super("LensDirt", fragment, {
      blendFunction,
      uniforms: new Map(Object.entries(shader.uniforms))
    })

    this._shaderMeta = meta
  }

  update(gl: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime: number) {
    super.update(gl, inputBuffer, deltaTime)
    this._shaderMeta.update(deltaTime, { gl })
  }
}
