import { useLayoutEffect } from "react"
import { useAudioContext } from "./hooks"

export type LinearRampProps = {
  property: string
  to: number
  duration: number
}

export const LinearRamp = ({ to, duration, property }: LinearRampProps) => {
  const parent = useAudioContext() as any

  useLayoutEffect(() => {
    if (!parent) return

    const time = parent.context.currentTime
    const prop = parent[property] as AudioParam

    if (!prop) {
      console.error("Invalid property", property)
      return
    }

    prop.linearRampToValueAtTime(to, time + duration)
  }, [parent])

  return null
}
