import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"
import { Stage } from "../../../configuration"
import { ECS } from "../state"

const tmpVec3 = new Vector3()

export const BulletSystem = () => {
  const bullets = ECS.useArchetype("isBullet")

  useFrame((_, dt) => {
    for (const bullet of bullets) {
      const { sceneObject } = bullet
      if (!sceneObject) return

      sceneObject.position.add(
        tmpVec3.set(0, 40 * dt, 0).applyQuaternion(sceneObject.quaternion)
      )
    }
  }, Stage.Normal)

  return null
}
