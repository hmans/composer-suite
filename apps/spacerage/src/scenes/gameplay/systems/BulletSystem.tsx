import * as RAPIER from "@dimforge/rapier3d-compat"
import { interactionGroups, usePhysicsWorld } from "@hmans/physics3d"
import { useFrame } from "@react-three/fiber"
import { between } from "randomish"
import { Vector3 } from "three"
import { Stage } from "../../../configuration"
import { ECS, Layers, spawnAsteroid, spawnDebris, spawnSparks } from "../state"

const hittableEntities = ECS.world.archetype("health", "rigidBody")

const tmpVec3 = new Vector3()

const ray = new RAPIER.Ray(
  new RAPIER.Vector3(0, 0, 0),
  new RAPIER.Vector3(0, 0, 0)
)

export const BulletSystem = () => {
  const bullets = ECS.world.archetype("isBullet", "sceneObject", "velocity")
  const { world } = usePhysicsWorld()

  useFrame(function bulletSystem(_, dt) {
    for (const bullet of bullets) {
      const { sceneObject } = bullet
      if (!sceneObject) return

      sceneObject.position.addScaledVector(bullet.velocity, dt)

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
        interactionGroups(Layers.Player)
      )

      if (hit) {
        const point = ray.pointAt(hit.toi)

        /* Destroy bullet */
        ECS.world.queue.destroyEntity(bullet)

        /* Spawn VFX */
        spawnDebris(bullet.sceneObject.position, bullet.sceneObject.quaternion)
        spawnSparks(bullet.sceneObject.position, bullet.sceneObject.quaternion)

        /* Find the entity that was hit */
        const otherBody = hit.collider.parent()
        const otherEntity = hittableEntities.entities.find(
          (e) => e.rigidBody.body === otherBody
        )

        if (otherEntity) {
          otherEntity.health -= 10

          /* TODO: move this into a separate system */
          if (otherEntity.health <= 0) {
            ECS.world.queue.destroyEntity(otherEntity)

            if (otherEntity.asteroid) {
              const { scale } = otherEntity.asteroid

              if (scale > 0.5) {
                const position = otherEntity.rigidBody!.body.translation()

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

        rigidBody.applyImpulseAtPoint(
          tmpVec3.set(0, 20, 0).applyQuaternion(bullet.sceneObject.quaternion),
          point,
          true
        )
      }
    }
  }, Stage.Normal)

  return null
}
