import { useLayoutEffect, useMemo } from "react"
import { createInput, Input } from "./vanilla"

export const useInput = (_input?: Input) => {
  const input = useMemo(() => _input || createInput(), [])

  useLayoutEffect(() => {
    input.start()
    return () => input.stop()
  }, [input])

  return input.get
}
