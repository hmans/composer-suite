import { useConst } from "@hmans/use-const"
import { useEffect } from "react"
import { createInput } from ".."

export const useInput = () => {
  const input = useConst(() => createInput())

  useEffect(() => {
    input.start()
    return () => input.stop()
  }, [input])

  return input
}
