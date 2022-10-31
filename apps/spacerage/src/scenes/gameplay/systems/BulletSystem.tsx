import * as RAPIER from "@dimforge/rapier3d-compat"
import { interactionGroups, useRapier } from "@react-three/rapier"
import { archetype } from "miniplex"
import { between, chance } from "randomish"
import { Vector3 } from "three"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { spawnAsteroid } from "../Asteroids"
import { spawnPickup } from "../Pickups"
import { ECS, Layers, queue } from "../state"
import { spawnAsteroidExplosion } from "../vfx/AsteroidExplosions"
import { spawnDebris } from "../vfx/Debris"
import { spawnSmokeVFX } from "../vfx/SmokeVFX"
import { spawnSparks } from "../vfx/Sparks"

const hittableEntities = ECS.world.where(archetype("health", "rigidBody"))

const tmpVec3 = new Vector3()

const ray = new RAPIER.Ray(
  new RAPIER.Vector3(0, 0, 0),
  new RAPIER.Vector3(0, 0, 0)
)

export const BulletSystem = () => {
  const bullets = ECS.world.where(archetype("bullet", "sceneObject"))
  const context = useRapier()
  const world = context.world.raw()

  return (
    <System
      name="BulletSystem"
      world={ECS.world}
      fun={(dt) => {
        for (const bullet of bullets) {
          /* COLLISIONS */
          /* Perform hit test */
          ray.origin = bullet.sceneObject.position

          ray.dir = tmpVec3
            .set(0, 0, -1)
            .applyQuaternion(bullet.sceneObject.quaternion)

          const hit = world.castRay(
            ray,
            10,
            true,
            undefined,
            interactionGroups(Layers.Bullet, Layers.Asteroid)
          )

          if (hit) {
            const point = ray.pointAt(hit.toi)

            /* Destroy bullet */
            queue(() => ECS.world.remove(bullet))

            /* Spawn VFX */
            spawnDebris(
              bullet.sceneObject.position,
              bullet.sceneObject.quaternion
            )
            spawnSparks({
              position: bullet.sceneObject.position,
              quaternion: bullet.sceneObject.quaternion
            })
            spawnSmokeVFX({
              position: bullet.sceneObject.position
            })

            /* Find the entity that was hit */
            const otherBody = hit.collider.parent()
            const otherEntity = hittableEntities.entities.find(
              (e) => e.rigidBody.raw() === otherBody
            )

            if (otherEntity) {
              otherEntity.health -= 10

              /* TODO: move this into a separate system */
              if (otherEntity.health <= 0) {
                queue(() => ECS.world.remove(otherEntity))

                if (otherEntity.asteroid) {
                  const { scale } = otherEntity.asteroid
                  const position = otherEntity
                    .rigidBody!.raw()
                    .translation() as Vector3

                  spawnAsteroidExplosion({
                    position: new Vector3(position.x, position.y, position.z),
                    scale: otherEntity.asteroid.scale
                  })

                  if (chance(scale)) {
                    spawnPickup({
                      position: otherEntity.sceneObject!.getWorldPosition(
                        new Vector3()
                      )
                    })
                  }

                  if (scale > 0.5) {
                    const number = between(3, 8)
                    const step = (Math.PI * 2) / number

                    for (let i = 0; i < number; i++) {
                      const angle = step * i

                      spawnAsteroid(
                        new Vector3(
                          position.x + Math.cos(angle) * scale * 1.5,
                          position.y + Math.sin(angle) * scale * 1.5,
                          0
                        ),
                        scale * between(0.3, 0.7)
                      )
                    }
                  }
                }
              }
            }

            /* Push the object we've hit */
            const collider = world.getCollider(hit.collider.handle)
            const rigidBody = world.getRigidBody(collider.handle)

            if (rigidBody)
              rigidBody.applyImpulseAtPoint(
                tmpVec3
                  .set(0, 20, 0)
                  .applyQuaternion(bullet.sceneObject.quaternion),
                point,
                true
              )
          }
        }
      }}
    />
  )
}
