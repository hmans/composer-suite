import * as PP from "postprocessing"
import { useContext, useLayoutEffect, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export const SMAAEffect = (
  props: ConstructorParameters<typeof PP.SMAAEffect>[0]
) => {
  const effect = useMemo(() => new PP.SMAAEffect(props), [])

  useLayoutEffect(() => {
    Object.assign(effect, props)
  }, [effect, props])

  useContext(EffectPassContext).useItem(effect)

  return null
}
