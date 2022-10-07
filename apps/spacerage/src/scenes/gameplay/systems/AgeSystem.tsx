import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS } from "../state"

const entities = ECS.world.archetype("age")

export const AgeSystem = () => (
  <System
    name="AgeSystem"
    world={ECS.world}
    updatePriority={Stage.Early}
    fun={(dt) => {
      for (const entity of entities) {
        entity.age += dt
      }
    }}
  />
)
