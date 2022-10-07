import * as PP from "postprocessing"
import React, {
  forwardRef,
  ReactNode,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo
} from "react"
import * as THREE from "three"
import { EffectComposerContext } from "../EffectComposer"

export type RenderPassProps = {
  children?: ReactNode
  camera: THREE.Camera
  scene: THREE.Scene
  ignoreBackground?: boolean
  clear?: boolean
}

export const RenderPass = forwardRef<PP.RenderPass, RenderPassProps>(
  (
    { children, camera, scene, ignoreBackground = false, clear = false },
    ref
  ) => {
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

    return <>{children}</>
  }
)
