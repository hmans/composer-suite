import { useConst } from "@hmans/use-const"
import { useEffect } from "react"
import { createInputManager } from "../createInputManager"

export const useInput = () => {
  const input = useConst(() => createInputManager())

  useEffect(() => {
    input.start()
    return () => input.stop()
  }, [input])

  return input
}
