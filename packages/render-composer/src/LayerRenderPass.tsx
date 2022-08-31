import { RenderPass } from "postprocessing"
import { Camera, Material, Scene, WebGLRenderer, WebGLRenderTarget } from "three"

export class LayerRenderPass extends RenderPass {
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
