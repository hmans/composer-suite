import { Vector3 } from "three"
import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS } from "../state"

const tmpVec3 = new Vector3()
const players = ECS.world.archetype("player")
const pickups = ECS.world.archetype("pickup")

export const AttractorSystem = () => (
  <System
    name="AttractorSystem"
    world={ECS.world}
    updatePriority={Stage.Early}
    fun={() => {
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
    }}
  />
)
