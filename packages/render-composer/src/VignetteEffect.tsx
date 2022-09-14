import * as PP from "postprocessing"
import { useContext, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export const VignetteEffect = () => {
  const effect = useMemo(() => new PP.VignetteEffect(), [])
  useContext(EffectPassContext).useItem(effect)
  return null
}
