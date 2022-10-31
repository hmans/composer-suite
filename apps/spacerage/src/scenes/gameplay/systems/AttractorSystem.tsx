import { useFrame } from "@react-three/fiber"
import { archetype } from "miniplex"
import { Vector3 } from "three"
import { Stage } from "../../../configuration"
import { ECS } from "../state"

const tmpVec3 = new Vector3()
const players = ECS.world.where(archetype("player"))
const pickups = ECS.world.where(archetype("pickup"))

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
