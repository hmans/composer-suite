import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo
} from "react"
import { EffectComposerContext } from "../EffectComposer"

export type RenderPassProps = {
  ignoreBackground?: boolean
  clear?: boolean
}

export const RenderPass = forwardRef<PP.RenderPass, RenderPassProps>(
  ({ ignoreBackground = false, clear = false }, ref) => {
    const scene = useThree((s) => s.scene)
    const camera = useThree((s) => s.camera)

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
