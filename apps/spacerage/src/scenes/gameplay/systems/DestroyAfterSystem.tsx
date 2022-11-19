import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS, queue } from "../state"

const entitiesToEliminate = ECS.world
  .with("destroyAfter", "age")
  .where((e) => e.age > e.destroyAfter)

export const DestroyAfterSystem = () => (
  <System
    name="DestroyAfterSystem"
    world={ECS.world}
    updatePriority={Stage.Early}
    fun={() => {
      for (const entity of entitiesToEliminate) {
        queue(() => ECS.world.remove(entity))
      }
    }}
  />
)
