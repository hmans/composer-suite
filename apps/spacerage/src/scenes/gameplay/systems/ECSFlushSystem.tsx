import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS } from "../state"

export const ECSFlushSystem = () => (
  <System
    world={ECS.world}
    name="ECSFlushSystem"
    updatePriority={Stage.Late}
    fun={() => ECS.world.queue.flush()}
  />
)
