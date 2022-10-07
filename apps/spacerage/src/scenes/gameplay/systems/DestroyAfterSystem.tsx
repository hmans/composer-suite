import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS } from "../state"

const entities = ECS.world.archetype("age", "destroyAfter")

export const DestroyAfterSystem = () => (
  <System
    name="DestroyAfterSystem"
    world={ECS.world}
    updatePriority={Stage.Early}
    fun={(dt) => {
      for (const entity of entities) {
        if (entity.age >= entity.destroyAfter) {
          ECS.world.queue.destroyEntity(entity)
        }
      }
    }}
  />
)
