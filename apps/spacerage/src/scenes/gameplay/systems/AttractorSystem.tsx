import { useFrame } from "@react-three/fiber"
import { archetype } from "bucketeer"
import { Vector3 } from "three"
import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS, worldBucket } from "../state"

const tmpVec3 = new Vector3()
const players = ECS.world.archetype("player")
const pickups = worldBucket.derive(archetype("isPickup"))

export const AttractorSystem = () => {
  useFrame(() => {
    const [player] = players
    if (!player) return

    const playerBody = player.rigidBody!

    /* Find all pickups and attract them towards player */
    for (const { rigidBody } of pickups) {
      const pickupBody = rigidBody!

      const direction = tmpVec3
        .copy(pickupBody.translation())
        .sub(playerBody.translation())

      const distance = direction.length()

      if (distance > 10) continue

      pickupBody.applyImpulse(
        direction.normalize().multiplyScalar(-2 / distance)
      )
    }
  }, Stage.Early)

  return null
}
