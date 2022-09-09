import { useConst } from "@hmans/use-const"
import { useAnimationFrame } from "@hmans/use-animation-frame"
import { useEffect } from "react"
import { createInput } from ".."

export const useInput = () => {
  const input = useConst(() => createInput())

  useEffect(() => {
    input.start()
    return () => input.stop()
  }, [input])

  useAnimationFrame(() => input.update())

  return input
}
