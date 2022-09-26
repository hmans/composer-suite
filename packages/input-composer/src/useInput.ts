import { useLayoutEffect, useMemo } from "react"
import { createInput, Input } from "./vanilla"

export const useInput = <T = Input>(fun?: (input: Input) => T) => {
  const input = useMemo(() => createInput(), [])

  useLayoutEffect(() => {
    input.start()
    return () => input.stop()
  }, [input])

  return () => {
    const currentInput = input.get()
    return (fun ? fun(currentInput) : currentInput) as T
  }
}
