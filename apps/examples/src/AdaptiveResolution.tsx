import { useFrame, useThree } from "@react-three/fiber"
import { FC, useRef } from "react"

type Props = {
  targetFPS?: number
  speed?: number
  samples?: number
}

export const AdaptiveResolution: FC<Props> = ({
  targetFPS = 60,
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

  const targetTime = 1 / targetFPS

  useFrame(() => {
    const averageTime = getFPS()

    /*
     * TODO: The following algorithm is super basic. It does the job, but has a bunch of
     *       edge cases that are not handled well.
     */
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

  return () => state.average
}
