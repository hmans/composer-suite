import { Text } from "@react-three/drei"
import { Keypress } from "../../lib/Keypress"
import { enterGameplay } from "../../state"

export const TitleScene = () => (
  <>
    <Keypress code="Space" onPress={enterGameplay} />
    <Text position={[0, 0, 10]} fontSize={1} textAlign="center">
      {"PRESS SPACE\nTO PONG"}
    </Text>
  </>
)
