import { useRef } from "react"

export const useConst = <T extends any>(ctor: () => T) => {
  const ref = useRef<T>()
  if (!ref.current) ref.current = ctor()

  return ref.current
}
