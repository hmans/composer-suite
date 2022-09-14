import * as PP from "postprocessing"
import { useContext, useLayoutEffect, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export const VignetteEffect = (
  props: ConstructorParameters<typeof PP.VignetteEffect>[0]
) => {
  const effect = useMemo(() => new PP.VignetteEffect(props), [])

  useLayoutEffect(() => {
    Object.assign(effect, props)
  }, [effect, props])

  useContext(EffectPassContext).useItem(effect)

  return null
}
