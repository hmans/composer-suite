import { useFrame, useThree } from "@react-three/fiber"
import { FC, useRef } from "react"

type Props = {
  minFPS?: number
  maxFPS?: number
  speed?: number
  samples?: number
}

export const AdaptiveResolution: FC<Props> = ({
  minFPS = 60,
  maxFPS = 100,
  speed = 0.02,
  samples = 20
}) => {
  /* Grab an FPS counter */
  const getFPS = useFPS(samples)

  /* Grab some state from R3F */
  const initialDpr = useThree((state) => state.viewport.initialDpr)
  const setDpr = useThree((state) => state.setDpr)

  /* The current DPR. We will be mutating this over time depending on the FPS. */
  const currentDpr = useRef(initialDpr)

  useFrame(() => {
    const fps = getFPS()

    if (fps < minFPS) {
      /* Oh no, things are slow, reduce DPR */
      currentDpr.current = Math.max(currentDpr.current - speed, 0.1)
    } else if (fps >= maxFPS) {
      /* Things are plenty fast, increase DPR */
      currentDpr.current = Math.min(currentDpr.current + speed, initialDpr)
    }

    setDpr(currentDpr.current)
  })

  return null
}

function useFPS(samples = 20) {
  const state = useRef({
    times: Array(samples).fill(0),
    sum: 0,
    average: 0
  }).current

  useFrame((_, dt) => {
    state.sum -= state.times.shift()!

    if (samples > state.times.length) {
      state.times.push(dt)
      state.sum += dt
    }

    state.average = state.sum / state.times.length
  })

  return () => 1 / state.average
}
