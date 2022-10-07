import { Physics } from "@react-three/rapier"
import { ReactNode, Suspense, useLayoutEffect, useRef, useState } from "react"
import { bitmask, Layers } from "render-composer"
import { Vec3 } from "shader-composer"
import { Color, Scene } from "three"
import { Skybox } from "../../common/Skybox"
import { Stage } from "../../configuration"
import {
  MiniplexEntityInspector,
  MiniplexInspector
} from "../../editor/MiniplexInspector"
import { SidebarTunnel } from "../../state"
import { Nebula } from "../menu/vfx/Nebula"
import { Asteroids } from "./Asteroids"
import { Bullets } from "./Bullets"
import { FollowCamera } from "./FollowCamera"
import { Pickups } from "./Pickups"
import { Player } from "./Player"
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
import { SmokeVFX } from "./vfx/SmokeVFX"
import { Sparks } from "./vfx/Sparks"
import * as RC from "render-composer"
import { createPortal, useThree } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"

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

      <RenderPass>
        <PerspectiveCamera position={[0, 0, 20]} makeDefault />
        <mesh>
          <icosahedronGeometry />
          <meshBasicMaterial color="yellow" />
        </mesh>
      </RenderPass>
    </Suspense>
  )
}

export const RenderPass = ({ children }: { children?: ReactNode }) => {
  const [scene] = useState(() => new Scene())

  return createPortal(
    <>
      {children}
      <RC.RenderPass clear={false} ignoreBackground />
      <RC.EffectPass />
    </>,
    scene,
    {}
  )
}

const PlayerInspector = () => {
  const [player] = ECS.useArchetype("player")

  return player ? <MiniplexEntityInspector entity={player} /> : null
}

export default GameplayScene
