import * as PP from "postprocessing"
import { forwardRef, useContext, useImperativeHandle, useMemo } from "react"
import { BasicDepthPacking } from "three"
import { EffectComposerContext } from "../EffectComposer"

export const DepthCopyPass = forwardRef<PP.DepthCopyPass>((_, ref) => {
  const pass = useMemo(
    () => new PP.DepthCopyPass({ depthPacking: BasicDepthPacking }),
    []
  )

  useImperativeHandle(ref, () => pass)

  useContext(EffectComposerContext).useItem(pass)

  return null
})
