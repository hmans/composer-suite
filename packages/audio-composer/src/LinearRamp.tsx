import { useLayoutEffect } from "react"
import { useAudioContext } from "./hooks"

export type LinearRampProps = {
  property: string
  value: number
  duration: number
}

export const LinearRamp = ({ value, duration, property }: LinearRampProps) => {
  const parent = useAudioContext() as any

  useLayoutEffect(() => {
    if (!parent) return

    const t = parent.context.currentTime
    const prop = parent[property] as AudioParam

    if (!prop) {
      console.error("Invalid property", property)
      return
    }

    prop.linearRampToValueAtTime(value, t + duration)
  }, [parent])

  return null
}
