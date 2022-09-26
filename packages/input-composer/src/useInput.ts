import { useLayoutEffect, useMemo } from "react"
import { createInput } from "./vanilla"

export const useInput = () => {
  const input = useMemo(() => createInput(), [])

  useLayoutEffect(() => {
    input.start()
    return () => input.stop()
  }, [input])

  return input.get
}
