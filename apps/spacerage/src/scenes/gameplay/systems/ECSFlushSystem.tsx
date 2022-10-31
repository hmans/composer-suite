import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS, queue } from "../state"

export const ECSFlushSystem = () => (
  <System
    world={ECS.world}
    name="ECSFlushSystem"
    updatePriority={Stage.Late}
    fun={() => queue.flush()}
  />
)
