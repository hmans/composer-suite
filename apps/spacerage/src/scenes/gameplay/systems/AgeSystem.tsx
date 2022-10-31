import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS } from "../state"
import { archetype } from "miniplex"

const entities = ECS.world.where(archetype("age"))
const withAge = ECS.world.where(archetype("age"))

export const AgeSystem = () => (
  <System
    name="AgeSystem"
    world={ECS.world}
    updatePriority={Stage.Early}
    fun={(dt) => {
      for (const entity of entities) {
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
