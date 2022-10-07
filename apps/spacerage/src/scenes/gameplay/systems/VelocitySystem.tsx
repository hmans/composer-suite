import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS } from "../state"

const entities = ECS.world.archetype("sceneObject", "velocity")

export const VelocitySystem = () => (
  <System
    name="VelocitySystem"
    world={ECS.world}
    updatePriority={Stage.Early}
    fun={(dt) => {
      for (const { sceneObject, velocity } of entities) {
        sceneObject.position.addScaledVector(velocity, dt)
      }
    }}
  />
)
