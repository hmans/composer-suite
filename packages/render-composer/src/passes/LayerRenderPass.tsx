import { useThree } from "@react-three/fiber"
import { RenderPass } from "postprocessing"
import { useContext, useMemo } from "react"
import {
  Camera,
  Material,
  Scene,
  WebGLRenderer,
  WebGLRenderTarget
} from "three"
import { EffectComposerContext } from "../EffectComposer"

export type LayerRenderPassProps = {
  layer: number
}

export const LayerRenderPass = ({ layer }: LayerRenderPassProps) => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  const pass = useMemo(
    () =>
      new LayerRenderPassImpl(
        scene,
        camera,
        undefined,
        camera.layers.mask & ~(1 << layer)
      ),
    [scene, camera]
  )

  useContext(EffectComposerContext).useItem(pass)

  return null
}

export class LayerRenderPassImpl extends RenderPass {
  constructor(
    scene: Scene,
    camera: Camera,
    overrideMaterial?: Material,
    public layerMask: number = 0xffffffff | 0
  ) {
    super(scene, camera, overrideMaterial)
  }

  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    outputBuffer: WebGLRenderTarget,
    deltaTime: number,
    stencilTest: boolean
  ) {
    const mask = this.camera.layers.mask
    this.camera.layers.mask = this.layerMask
    super.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest)
    this.camera.layers.mask = mask
  }
}
