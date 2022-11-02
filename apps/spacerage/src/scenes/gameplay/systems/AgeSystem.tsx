import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS } from "../state"

const withAge = ECS.world.with("age")

export const AgeSystem = () => (
  <System
    name="AgeSystem"
    world={ECS.world}
    updatePriority={Stage.Early}
    fun={(dt) => {
      for (const entity of withAge) {
        entity.age += dt
      }

      /* Squeeze Bucketeer in */
      for (let i = withAge.entities.length - 1; i >= 0; i--) {
        const entity = withAge.entities[i]
        entity.age += dt
      }
    }}
  />
)
