import { useKeypress } from "./useKeypress"

export const Keypress = ({
  code,
  onPress
}: {
  code: string
  onPress: () => void
}) => {
  useKeypress(code, onPress)
  return null
}
