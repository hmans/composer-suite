import { useLoader } from "@react-three/fiber"
import {
  ConvexHullCollider,
  interactionGroups,
  RigidBody
} from "@react-three/rapier"
import { PositionalAudio } from "audio-composer"
import { AudioLoader, Mesh } from "three"
import { GLTFLoader } from "three-stdlib"
import { EngineHumSFX } from "./sfx/EngineHumSFX"
import { ECS, Layers } from "./state"

export const Player = () => {
  const gltf = useLoader(GLTFLoader, "/models/spaceship25.gltf")

  return (
    <ECS.Entity>
      <ECS.Component name="player" value={true} />
      <ECS.Component name="rigidBody">
        <RigidBody
          angularDamping={3}
          linearDamping={1}
          enabledTranslations={[true, true, false]}
          enabledRotations={[false, false, true]}
          scale={0.5}
          collisionGroups={interactionGroups(Layers.Player, [
            Layers.Asteroid,
            Layers.Pickup
          ])}
        >
          <ECS.Component name="sceneObject">
            <group>
              <ConvexHullCollider
                args={[
                  (gltf.scene.children[0] as Mesh).geometry.attributes.position
                    .array as Float32Array
                ]}
              />
              <primitive object={gltf.scene} />

              <PositionalAudio url="/sounds/taikobeat.mp3" loop autoplay />

              <EngineHumSFX />
            </group>
          </ECS.Component>
        </RigidBody>
      </ECS.Component>
    </ECS.Entity>
  )
}

useLoader.preload(AudioLoader, "/sounds/taikobeat.mp3")
