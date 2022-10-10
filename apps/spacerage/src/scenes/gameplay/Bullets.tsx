import { Color, Quaternion, Vector3 } from "three"
import { InstancedParticles, Particle } from "vfx-composer-r3f"
import { PewPewSFX } from "./sfx/PewPewSFX"
import { ECS } from "./state"

export const Bullets = () => (
  <InstancedParticles capacity={200}>
    <planeGeometry args={[0.1, 0.8]} />
    <meshBasicMaterial color={new Color("orange").multiplyScalar(4)} />

    <ECS.ArchetypeEntities archetype="bullet">
      {({ bullet }) => bullet}
    </ECS.ArchetypeEntities>
  </InstancedParticles>
)

export const spawnBullet = (
  position: Vector3,
  quaternion: Quaternion,
  velocity: Vector3
) =>
  ECS.world.createEntity({
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
