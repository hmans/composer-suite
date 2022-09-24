import * as Physics from "@hmans/physics3d"
import { Skybox } from "../../common/Skybox"
import { Stage } from "../../configuration"
import { Asteroids } from "./Asteroids"
import { Bullets } from "./Bullets"
import { Debris } from "./Debris"
import { FollowCamera } from "./FollowCamera"
import { Player } from "./Player"
import { AgeSystem } from "./systems/AgeSystem"
import { BulletSystem } from "./systems/BulletSystem"
import { DestroyAfterSystem } from "./systems/DestroyAfterSystem"
import { ECSFlushSystem } from "./systems/ECSFlushSystem"

export const GameplayScene = () => {
  return (
    <group>
      <Physics.World updatePriority={Stage.Physics} gravity={[0, 0, 0]}>
        <Skybox />
        <FollowCamera />

        <ambientLight intensity={0.1} />
        <directionalLight position={[30, 0, 30]} intensity={1} />

        <Debris />

        <Player />
        <Asteroids />
        <Bullets />

        <AgeSystem />
        <DestroyAfterSystem />
        <BulletSystem />
        <ECSFlushSystem />
      </Physics.World>
    </group>
  )
}
