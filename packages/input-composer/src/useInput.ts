import { useGamepad } from "./useGamepad"

export const useInput = () => {
  const gamepad = useGamepad()
  return { gamepad }
}
