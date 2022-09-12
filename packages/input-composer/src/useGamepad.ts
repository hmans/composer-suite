import { useConst } from "@hmans/use-const"
import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"

export const useGamepad = () => {
  const state = useConst(() => ({
    gamepads: navigator.getGamepads()
  }))

  useFrame(() => {
    state.gamepads = navigator.getGamepads()
  })

  return useMemo(
    () => (index: number) => {
      const gamepad = state.gamepads[index]

      return {
        axis: (index: number) => gamepad?.axes[index] ?? 0,
        vector: (horizontalAxis: number, verticalAxis: number) => ({
          x: gamepad?.axes[horizontalAxis] ?? 0,
          y: gamepad?.axes[verticalAxis] ?? 0
        }),
        button: (index: number) => gamepad?.buttons[index].value ?? 0
      }
    },
    []
  )
}
