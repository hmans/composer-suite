import { bitmask, Layers } from "render-composer"
import { Vec3 } from "shader-composer"
import { Color } from "three"
import { Skybox } from "../../common/Skybox"
import { Stage } from "../../configuration"
import { Nebula } from "../menu/vfx/Nebula"
import { Asteroids } from "./Asteroids"
import { Bullets } from "./Bullets"
import { Debris } from "./vfx/Debris"
import { FollowCamera } from "./FollowCamera"
import { Player } from "./Player"
import { Sparks } from "./vfx/Sparks"
import { AgeSystem } from "./systems/AgeSystem"
import { BulletSystem } from "./systems/BulletSystem"
import { DestroyAfterSystem } from "./systems/DestroyAfterSystem"
import { ECSFlushSystem } from "./systems/ECSFlushSystem"
import { AsteroidExplosions } from "./vfx/AsteroidExplosions"
import { VelocitySystem } from "./systems/VelocitySystem"
import { Debug, Physics } from "@react-three/rapier"
import { Suspense } from "react"
import { BackgroundAsteroids } from "./vfx/BackgroundAsteroids"

const GameplayScene = () => {
  return (
    <Suspense>
      <fog attach="fog" args={["#000000", 30, 300]} />
      <group>
        <Physics
          updatePriority={Stage.Physics}
          gravity={[0, 0, 0]}
          colliders={false}
          timeStep="vary"
        >
          {/* <Debug /> */}
          <Skybox />
          <FollowCamera />

          <ambientLight
            intensity={0.1}
            layers-mask={bitmask(Layers.Default, Layers.TransparentFX)}
          />
          <directionalLight
            position={[30, 0, 30]}
            intensity={1}
            layers-mask={bitmask(Layers.Default, Layers.TransparentFX)}
          />

          <Nebula
            dimensions={Vec3([50, 50, 15])}
            amount={80}
            opacity={0.05}
            minSize={8}
            maxSize={30}
            rotationSpeed={0.1}
            color={new Color("#fff")}
          />

          <Player />
          <Asteroids initial={100} />
          <Bullets />
          <Debris />
          <Sparks />
          <AsteroidExplosions />
          <BackgroundAsteroids />

          <AgeSystem />
          <DestroyAfterSystem />
          <VelocitySystem />
          <BulletSystem />
          <ECSFlushSystem />
        </Physics>
      </group>
    </Suspense>
  )
}

export default GameplayScene
