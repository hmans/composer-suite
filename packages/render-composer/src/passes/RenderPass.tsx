import * as PP from "postprocessing"
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo
} from "react"
import * as THREE from "three"
import { EffectComposerContext } from "../EffectComposer"

export type RenderPassProps = {
  camera: THREE.Camera
  scene: THREE.Scene
  ignoreBackground?: boolean
  clear?: boolean
}

export const RenderPass = forwardRef<PP.RenderPass, RenderPassProps>(
  ({ camera, scene, ignoreBackground = false, clear = false }, ref) => {
    const pass = useMemo(
      () => new PP.RenderPass(scene, camera),
      [scene, camera]
    )

    useLayoutEffect(() => {
      pass.ignoreBackground = ignoreBackground
      pass.clearPass.enabled = clear
    })

    useImperativeHandle(ref, () => pass)

    useContext(EffectComposerContext).useItem(pass)

    return null
  }
)
