import { useFrame, useThree } from "@react-three/fiber"
import { FC, useMemo, useRef } from "react"

type Props = {
  targetFPS?: number
  speed?: number
  smoothness?: number
}

export const AdaptiveResolution: FC<Props> = ({
  targetFPS = 60,
  speed = 0.02,
  smoothness = 20
}) => {
  /* Grab an FPS counter */
  const getFPS = useFPS(smoothness)

  /* Grab some state from R3F */
  const initialDpr = useThree((state) => state.viewport.initialDpr)
  const setDpr = useThree((state) => state.setDpr)

  /* The current DPR. We will be mutating this over time depending on the FPS. */
  const currentDpr = useRef(initialDpr)

  const targetTime = 1 / targetFPS

  useFrame(() => {
    const averageTime = getFPS()

    if (averageTime > targetTime * 1.1) {
      currentDpr.current = Math.max(currentDpr.current - speed, 0.1)
    } else if (averageTime < targetTime * 0.9) {
      currentDpr.current = Math.min(currentDpr.current + speed, initialDpr)
    }

    // console.log(currentDpr.current)
    setDpr(currentDpr.current)
  })

  return null
}

function useFPS(smoothness = 20) {
  const state = useMemo(
    () => ({
      times: Array(smoothness).fill(0),
      sum: 0,
      average: 0
    }),
    []
  )

  useFrame((_, dt) => {
    state.sum -= state.times.shift()!
    state.times.push(dt)
    state.sum += dt

    state.average = state.sum / smoothness
  })

  return () => state.average
}
