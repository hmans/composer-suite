import { archetype } from "bucketeer"
import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS, worldBucket } from "../state"

const entities = ECS.world.archetype("age", "destroyAfter")

const withDestroyAfter = worldBucket.derive(archetype("destroyAfter", "age"))

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
          worldBucket.remove(entity)
        }
      }
    }}
  />
)
