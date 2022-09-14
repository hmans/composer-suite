import * as PP from "postprocessing"
import { forwardRef, useContext, useImperativeHandle, useMemo } from "react"
import { EffectComposerContext } from "./EffectComposer"

export const CopyPass = forwardRef<PP.CopyPass>((_, ref) => {
  const pass = useMemo(() => new PP.CopyPass(), [])
  useContext(EffectComposerContext).useItem(pass)
  useImperativeHandle(ref, () => pass)
  return null
})
