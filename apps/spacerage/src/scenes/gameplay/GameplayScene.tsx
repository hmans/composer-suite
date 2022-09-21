import { Skybox } from "../../common/Skybox"
import { Player } from "./Player"

export const GameplayScene = () => {
  return (
    <group>
      <Skybox />

      <ambientLight intensity={0.1} />
      <directionalLight position={[30, 0, 30]} intensity={1} />

      <Player />
    </group>
  )
}
