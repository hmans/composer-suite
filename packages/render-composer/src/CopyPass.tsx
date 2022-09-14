import * as PP from "postprocessing"
import { useContext, useMemo } from "react"
import { EffectComposerContext } from "./EffectComposer"

export const CopyPass = () => {
  const pass = useMemo(() => new PP.CopyPass(), [])
  useContext(EffectComposerContext).useItem(pass)
  return null
}
