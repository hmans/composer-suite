import { EffectCallback, useEffect } from "react"

export const Effect = ({ callback }: { callback?: EffectCallback }) => {
  useEffect(callback)
  return null
}
