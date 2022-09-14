import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import { useContext, useLayoutEffect, useMemo } from "react"
import { EffectPassContext } from "../EffectPass"

export const usePostProcessingEffect = <T extends PP.Effect, P>(
  ctor: () => T,
  props: P
) => {
  /* Create effect */
  const effect = useMemo(ctor, [])

  /* Update props on rerender */
  useLayoutEffect(() => {
    Object.assign(effect, props)
  }, [effect, props])

  /* Handle resolution changes */
  const size = useThree((s) => s.size)
  useLayoutEffect(() => {
    effect.setSize(size.width, size.height)
  }, [effect, size.width, size.height])

  /* Register with the effect pass */
  useContext(EffectPassContext).useItem(effect)

  return effect
}
