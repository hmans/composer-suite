import { useThree } from "@react-three/fiber"
import { RenderPass } from "postprocessing"
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo
} from "react"
import {
  Camera,
  Material,
  Scene,
  WebGLRenderer,
  WebGLRenderTarget
} from "three"
import { EffectComposerContext } from "../EffectComposer"

export type LayerRenderPassProps = {
  layerMask: number
  ignoreBackground?: boolean
  clear?: boolean
}

export const LayerRenderPass = forwardRef<
  LayerRenderPassImpl,
  LayerRenderPassProps
>(({ layerMask, ignoreBackground = false, clear = false }, ref) => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  const pass = useMemo(
    () => new LayerRenderPassImpl(scene, camera, undefined, layerMask),
    [scene, camera]
  )

  useLayoutEffect(() => {
    pass.ignoreBackground = ignoreBackground
    pass.clearPass.enabled = clear
  })

  useContext(EffectComposerContext).useItem(pass)

  useImperativeHandle(ref, () => pass)

  return null
})

export class LayerRenderPassImpl extends RenderPass {
  constructor(
    scene: Scene,
    camera: Camera,
    overrideMaterial?: Material,
    public layerMask: number = 0xffffffff
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
