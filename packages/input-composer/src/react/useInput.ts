import { useConst } from "@hmans/use-const"
import { useEffect } from "react"
import { createInputManager } from "../createInputManager"
import { useFrame } from "@react-three/fiber"

export const useInput = () => {
  const input = useConst(() => createInputManager())

  useEffect(() => {
    input.start()
    return () => input.stop()
  }, [input])

  useFrame(() => input.update())

  return input
}
