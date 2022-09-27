import { Color, Object3D, Quaternion, Vector3 } from "three"
import { InstancedParticles, Particle, ParticleProps } from "vfx-composer-r3f"
import { JSXEntities } from "../../lib/JSXEntities"
import { ECS, ECS2, isBullet } from "./state"

export const Bullets = () => {
  const bullets = ECS2.useIndex(isBullet)

  console.log("re-render bullets", bullets)

  return (
    <InstancedParticles capacity={200}>
      <planeGeometry args={[0.1, 0.8]} />
      <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />
      <JSXEntities archetype={["isBullet"]} />
    </InstancedParticles>
  )
}

export const Bullet = (props: ParticleProps) => (
  <ECS.Component name="sceneObject">
    <Particle {...props} matrixAutoUpdate />
  </ECS.Component>
)

export const spawnBullet = (
  position: Vector3,
  quaternion: Quaternion,
  velocity: Vector3
) => {
  /* Miniplex */
  ECS.world.createEntity({
    isBullet: true,
    age: 0,
    destroyAfter: 1,
    velocity,
    jsx: <Bullet position={position} quaternion={quaternion} />
  })

  /* Entity Composer */
  ECS2.add({
    age: 0,
    destroyAfter: 1,
    bullet: true,
    velocity,
    jsx: <Bullet position={position} quaternion={quaternion} />
  })
}
