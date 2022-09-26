import { useFrame } from "@react-three/fiber"
import { Stage } from "../../../configuration"
import { ECS } from "../state"

export const DestroyAfterSystem = () => {
  const entities = ECS.world.archetype("age", "destroyAfter")

  useFrame(() => {
    for (const entity of entities) {
      if (entity.age >= entity.destroyAfter) {
        ECS.world.queue.destroyEntity(entity)
      }
    }
  }, Stage.Early)

  return null
}
