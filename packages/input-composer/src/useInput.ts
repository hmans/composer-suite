import { useGamepad } from "./useGamepad"
import { useKeyboard } from "./useKeyboard"

export const useInput = () => {
  const gamepad = useGamepad()
  const keyboard = useKeyboard()

  return { gamepad, keyboard }
}
