import { useFrame, useThree } from "@react-three/fiber"
import { FC, useRef } from "react"

type Props = {
  targetFPS?: number
  speed?: number
}

export const AdaptiveResolution: FC<Props> = ({
  targetFPS = 60,
  speed = 0.02
}) => {
  const initialDpr = useThree((state) => state.viewport.initialDpr)
  const setDpr = useThree((state) => state.setDpr)

  const currentDpr = useRef(initialDpr)

  const times = useRef([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const sum = useRef(0)
  const length = times.current.length
  const targetTime = 1 / targetFPS

  useFrame((_, dt) => {
    sum.current -= times.current.shift()!
    times.current.push(dt)
    sum.current += dt

    const averageTime = sum.current / length

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
