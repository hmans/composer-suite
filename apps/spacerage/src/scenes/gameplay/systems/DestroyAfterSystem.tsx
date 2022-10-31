import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS } from "../state"
import { archetype } from "miniplex"

const entities = ECS.world.where(archetype("age", "destroyAfter"))

const withDestroyAfter = ECS.world.where(archetype("destroyAfter", "age"))

export const DestroyAfterSystem = () => (
  <System
    name="DestroyAfterSystem"
    world={ECS.world}
    updatePriority={Stage.Early}
    fun={() => {
      for (const entity of entities) {
        if (entity.age >= entity.destroyAfter) {
          ECS.world.queue.destroyEntity(entity)
        }
      }

      /* Squeeze Bucketeer in */
      for (let i = withDestroyAfter.entities.length - 1; i >= 0; i--) {
        const entity = withDestroyAfter.entities[i]
        if (entity.age >= entity.destroyAfter) {
          ECS.world.remove(entity)
        }
      }
    }}
  />
)
