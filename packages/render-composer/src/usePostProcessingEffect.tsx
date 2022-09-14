import * as PP from "postprocessing"
import { useContext, useLayoutEffect, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export const usePostProcessingEffect = <T extends PP.Effect, P>(
  ctor: () => T,
  props: P
) => {
  const effect = useMemo(ctor, [])

  useLayoutEffect(() => {
    Object.assign(effect, props)
  }, [effect, props])

  useContext(EffectPassContext).useItem(effect)

  return effect
}
