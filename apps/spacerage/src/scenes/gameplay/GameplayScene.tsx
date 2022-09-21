import { Skybox } from "../../common/Skybox"
import { Player } from "./Player"
import { Physics } from "@react-three/rapier"
import { FollowCamera } from "./FollowCamera"
import { Stage } from "../../configuration"

export const GameplayScene = () => {
  return (
    <group>
      <Physics
        gravity={[0, 0, 0]}
        timeStep={1 / 100}
        updatePriority={Stage.Physics}
      >
        <Skybox />
        <FollowCamera />

        <ambientLight intensity={0.1} />
        <directionalLight position={[30, 0, 30]} intensity={1} />

        <Player />
      </Physics>
    </group>
  )
}
