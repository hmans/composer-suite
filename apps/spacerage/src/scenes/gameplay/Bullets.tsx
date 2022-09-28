import { Color, Quaternion, Vector3 } from "three"
import { InstancedParticles, Particle, ParticleProps } from "vfx-composer-r3f"
import { ECS } from "./state"

export const Bullets = () => (
  /* InstancedParticles is VFX Composer's wrapper around InstancedMesh. */
  <InstancedParticles capacity={200}>
    <planeGeometry args={[0.1, 0.8]} />
    <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />

    {/* This will automatically render the JSX of all bullets tagged with `isBullet`. */}
    <ECS.ArchetypeEntities archetype={["isBullet", "jsx"]}>
      {(entity) => entity.jsx}
    </ECS.ArchetypeEntities>
  </InstancedParticles>
)

export const Bullet = (props: ParticleProps) => (
  /* When the bullet renders, it adds a `sceneObject` component to the entity.
  The systems that simulates velocity needs this in order to move the bullet. */
  <ECS.Component name="sceneObject">
    {/* The actual scene object. This is a controlled particle, ie. a scene object
    that will continuously update the matrix of a specific instance. */}
    <Particle {...props} matrixAutoUpdate />
  </ECS.Component>
)

export const spawnBullet = (
  position: Vector3,
  quaternion: Quaternion,
  velocity: Vector3
) =>
  ECS.world.createEntity({
    isBullet: true,
    age: 0,
    destroyAfter: 1,
    velocity,
    jsx: <Bullet position={position} quaternion={quaternion} />
  })
