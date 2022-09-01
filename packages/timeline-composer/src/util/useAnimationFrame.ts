import { useEffect } from "react"
import { clamp01 } from "./clamp"

export const useAnimationFrame = (callback: FrameRequestCallback, deps?: any[]) => {
  useEffect(() => {
    let id: number
    let lastTime: number

    const tick = (time: number) => {
      id = requestAnimationFrame(tick)

      /* Initialize lastTime if it doesn't exist. */
      if (!lastTime) lastTime = time

      /* Determine delta time, clamped to 1 second max. */
      const diff = time - lastTime
      const dt = clamp01(diff / 1000)
      lastTime = time

      /* Invoke callback. */
      callback(dt)
    }

    id = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(id)
    }
  }, deps)
}
