import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"
import { Stage } from "../../../configuration"
import { ECS } from "../state"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { usePhysicsWorld } from "@hmans/physics3d"

const tmpVec3 = new Vector3()

const ray = new RAPIER.Ray(
  new RAPIER.Vector3(0, 0, 0),
  new RAPIER.Vector3(0, 0, 0)
)

export const BulletSystem = () => {
  const bullets = ECS.world.archetype("isBullet", "sceneObject")
  const { world } = usePhysicsWorld()

  useFrame((_, dt) => {
    for (const bullet of bullets) {
      const { sceneObject } = bullet
      if (!sceneObject) return

      sceneObject.position.add(
        tmpVec3.set(0, 40 * dt, 0).applyQuaternion(sceneObject.quaternion)
      )

      /* COLLISIONS */
      /* Perform hit test */
      ray.origin = bullet.sceneObject.position

      ray.dir = tmpVec3
        .set(0, 0, -1)
        .applyQuaternion(bullet.sceneObject.quaternion)

      const hit = world.castRay(ray, 10, true, 1)

      if (hit) {
        const point = ray.pointAt(hit.toi)

        /* Destroy bullet */
        ECS.world.queue.destroyEntity(bullet)

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
