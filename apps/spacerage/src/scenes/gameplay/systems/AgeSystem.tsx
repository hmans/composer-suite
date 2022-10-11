import { archetype } from "bucketeer"
import { Stage } from "../../../configuration"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { ECS, worldBucket } from "../state"

const entities = ECS.world.archetype("age")

const withAge = worldBucket.derive(archetype("age"))

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
