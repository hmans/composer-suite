import * as PP from "postprocessing"
import { useContext, useLayoutEffect, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export type SMAAEffectProps = ConstructorParameters<typeof PP.SMAAEffect>[0]

export const SMAAEffect = (props: SMAAEffectProps) => {
  const effect = useMemo(() => new PP.SMAAEffect(props), [])

  useLayoutEffect(() => {
    Object.assign(effect, props)
  }, [effect, props])

  useContext(EffectPassContext).useItem(effect)

  return null
}
