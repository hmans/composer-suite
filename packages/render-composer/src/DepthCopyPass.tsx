import * as PP from "postprocessing"
import { useContext, useMemo } from "react"
import { BasicDepthPacking } from "three"
import { EffectComposerContext } from "./EffectComposer"

export const DepthCopyPass = () => {
  const pass = useMemo(
    () => new PP.DepthCopyPass({ depthPacking: BasicDepthPacking }),
    []
  )

  useContext(EffectComposerContext).useItem(pass)

  return null
}
