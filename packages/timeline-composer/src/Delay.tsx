import React, { FC, ReactNode, useRef, useState } from "react"
import { useAnimationFrame } from "./util/useAnimationFrame"

type DelayProps = {
  children?: ReactNode
  seconds: number
  onComplete?: () => void
}

export const Delay: FC<DelayProps> = ({ seconds, onComplete, children }) => {
  const ready = useDelay(seconds, onComplete)
  return ready ? <>{children}</> : null
}

export const useDelay = (seconds: number, onComplete?: () => void) => {
  const [ready, setReady] = useState(false)
  const timeRemaining = useRef(seconds)

  useAnimationFrame((dt) => {
    if (ready) return

    timeRemaining.current -= dt

    if (timeRemaining.current <= 0) {
      onComplete?.()
      setReady(true)
    }
  })

  return ready
}
