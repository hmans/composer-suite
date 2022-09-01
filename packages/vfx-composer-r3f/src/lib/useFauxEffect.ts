import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

/* TODO: Extract this into hmans/things or similar */

export function useFauxEffect<T>(
  dependencyCallback: () => T,
  callback: (args: T) => void,
  renderPriority = 0
) {
  const value = useRef<T>(null!)

  useFrame(() => {
    const newValue = dependencyCallback()

    if (value.current !== newValue) {
      value.current = newValue
      callback(newValue)
    }
  }, renderPriority)
}
