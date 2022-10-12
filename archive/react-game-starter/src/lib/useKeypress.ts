import { KeyCode } from "@hmans/controlfreak"
import { useEffect } from "react"

export const useKeypress = (code: KeyCode, callback: () => void) => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === code) {
        callback()
      }
    }

    window.addEventListener("keydown", handleKeydown)

    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  })
}
