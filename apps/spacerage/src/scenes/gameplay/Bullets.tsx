import { Color, Quaternion, Vector3 } from "three"
import { InstancedParticles, Particle, ParticleProps } from "vfx-composer-r3f"
import { autoDestroy, ECS } from "./state"

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

/* The actual scene object. This is a controlled particle, ie. a scene object
that will continuously update the matrix of a specific instance. */
export const Bullet = (props: ParticleProps) => (
  <Particle {...props} matrixAutoUpdate />
)

export const spawnBullet = (
  position: Vector3,
  quaternion: Quaternion,
  velocity: Vector3
) =>
  /* Create an ECS entity. In Miniplex, entities are just normal objects, so we can use
  all the usual object composition tools at our disposal. */
  ECS.world.createEntity({
    ...autoDestroy(1),
    isBullet: true,
    velocity,

    /* In this project, entities may have a `jsx` component containing a JSX element.
    This is what we use to "render" the entity above. */
    jsx: (
      <ECS.Component name="sceneObject">
        <Bullet position={position} quaternion={quaternion} />
      </ECS.Component>
    )
  })
