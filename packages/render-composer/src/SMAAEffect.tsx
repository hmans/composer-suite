import * as PP from "postprocessing"
import { useContext, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export const SMAAEffect = () => {
  const effect = useMemo(() => new PP.SMAAEffect(), [])
  useContext(EffectPassContext).useItem(effect)
  return null
}
