import { Skybox } from "../../common/Skybox"
import * as Physics from "@hmans/physics3d"
import { FollowCamera } from "./FollowCamera"
import { Player } from "./Player"

export const GameplayScene = () => {
  return (
    <group>
      <Physics.World>
        <Skybox />
        <FollowCamera />

        <ambientLight intensity={0.1} />
        <directionalLight position={[30, 0, 30]} intensity={1} />

        <Player />
      </Physics.World>
    </group>
  )
}
