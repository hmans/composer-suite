import { PerspectiveCamera, Text } from "@react-three/drei"
import { Color } from "three"
import { ScenePass } from "../../lib/ScenePass"

export const HUD = () => {
  return (
    <ScenePass>
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />

      <Text color={new Color("hotpink")} fontSize={1} position={[-3, 7, 0]}>
        723.389.150
      </Text>
    </ScenePass>
  )
}
