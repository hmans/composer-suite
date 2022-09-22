import * as Physics from "@hmans/physics3d"
import { Skybox } from "../../common/Skybox"
import { Stage } from "../../configuration"
import { Asteroid } from "./Asteroid"
import { FollowCamera } from "./FollowCamera"
import { Player } from "./Player"

export const GameplayScene = () => {
  return (
    <group>
      <Physics.World updatePriority={Stage.Physics} gravity={[0, 0, 0]}>
        <Skybox />
        <FollowCamera />

        <ambientLight intensity={0.1} />
        <directionalLight position={[30, 0, 30]} intensity={1} />

        <Player />
        <Asteroid position={[5, 3, 0]} />
        <Asteroid position={[-3, -5, 0]} />
      </Physics.World>
    </group>
  )
}
