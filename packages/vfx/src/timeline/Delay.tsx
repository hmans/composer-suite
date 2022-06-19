import { useFrame } from "@react-three/fiber"
import React, { FC, ReactNode, useRef, useState } from "react"

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

  /*
  Hello! You might be wondering why we don't just use `setTimeout` here. We could do exactly that!
  But we're also preparing for a potential future where the deltatime passed into r3f's useFrame
  hook is scaled to something other than 1.0. Using system-level timeouts would entirely sidestep
  all of that.
  */

  useFrame((_, dt) => {
    if (ready) return

    timeRemaining.current -= dt

    if (timeRemaining.current <= 0) {
      onComplete?.()
      setReady(true)
    }
  })

  return ready
}
