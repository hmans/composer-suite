import { PerspectiveCamera, Text } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { Composable, Modules } from "material-composer-r3f"
import { Suspense } from "react"
import { bitmask, Layers } from "render-composer"
import { GlobalTime, Vec3 } from "shader-composer"
import { Color } from "three"
import { Skybox } from "../../common/Skybox"
import { Stage } from "../../configuration"
import {
  MiniplexEntityInspector,
  MiniplexInspector
} from "../../editor/MiniplexInspector"
import { ScenePass } from "../../lib/ScenePass"
import { SidebarTunnel } from "../../state"
import { Nebula } from "../menu/vfx/Nebula"
import { Asteroids } from "./Asteroids"
import { Bullets } from "./Bullets"
import { FollowCamera } from "./FollowCamera"
import { Pickups } from "./Pickups"
import { Player } from "./Player"
import { PostProcessing } from "./PostProcessing"
import { ECS } from "./state"
import { AgeSystem } from "./systems/AgeSystem"
import { AttractorSystem } from "./systems/AttractorSystem"
import { BulletSystem } from "./systems/BulletSystem"
import { DestroyAfterSystem } from "./systems/DestroyAfterSystem"
import { ECSFlushSystem } from "./systems/ECSFlushSystem"
import { PlayerSystem } from "./systems/PlayerSystem"
import { VelocitySystem } from "./systems/VelocitySystem"
import { AsteroidExplosions } from "./vfx/AsteroidExplosions"
import { BackgroundAsteroids } from "./vfx/BackgroundAsteroids"
import { Debris } from "./vfx/Debris"
import { DustVFX } from "./vfx/DustVFX"
import { SmokeVFX } from "./vfx/SmokeVFX"
import { Sparks } from "./vfx/Sparks"

const GameplayScene = () => {
  return (
    <Suspense>
      <PostProcessing />

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

          {/* Lights */}
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
          <Pickups />
          <Bullets />
          <Debris />
          <Sparks />
          <SmokeVFX />
          <DustVFX capacity={25000} />
          <AsteroidExplosions />
          <BackgroundAsteroids />

          <SidebarTunnel.In>
            <MiniplexInspector world={ECS.world} />
            <PlayerInspector />
          </SidebarTunnel.In>

          <AgeSystem />
          <DestroyAfterSystem />
          <AttractorSystem />
          <PlayerSystem />
          <VelocitySystem />
          <BulletSystem />
          <ECSFlushSystem />
        </Physics>
      </group>

      <HUD />
    </Suspense>
  )
}

const HUD = () => {
  return (
    <>
      <ScenePass>
        <PerspectiveCamera position={[0, 0, 20]} makeDefault />

        <Text
          color={new Color("hotpink").multiplyScalar(10)}
          fontSize={2}
          position={[-3, 7, 0]}
          rotation={[0, 0.8, 0.3]}
        >
          723.389.150
          <Composable.meshBasicMaterial
            attach="material"
            color={new Color("hotpink").multiplyScalar(3)}
            depthTest={false}
          >
            <Modules.SurfaceWobble offset={GlobalTime} amplitude={0.2} />
          </Composable.meshBasicMaterial>
        </Text>
      </ScenePass>

      {/* <RC.EffectPass>
        <RC.SelectiveBloomEffect intensity={4} luminanceThreshold={1} />
      </RC.EffectPass> */}
    </>
  )
}

const PlayerInspector = () => {
  const [player] = ECS.useArchetype("player")

  return player ? <MiniplexEntityInspector entity={player} /> : null
}

export default GameplayScene
