import { Color, Quaternion, Vector3 } from "three"
import { InstancedParticles, Particle } from "vfx-composer-r3f"
import { PewPewSFX } from "./sfx/PewPewSFX"
import { ECS } from "./state"

export const Bullets = () => (
  <InstancedParticles capacity={200}>
    <planeGeometry args={[0.1, 0.8]} />
    <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />

    <ECS.Archetype with="bullet">{({ bullet }) => bullet}</ECS.Archetype>
  </InstancedParticles>
)

export const spawnBullet = (
  position: Vector3,
  quaternion: Quaternion,
  velocity: Vector3
) =>
  ECS.world.add({
    age: 0,
    destroyAfter: 1,
    velocity,

    bullet: (
      <>
        <ECS.Component name="sceneObject">
          <Particle
            position={position}
            quaternion={quaternion}
            matrixAutoUpdate
          />
        </ECS.Component>

        <PewPewSFX />
      </>
    )
  })
