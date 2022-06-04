import ECS from "../ECS"

const { entities } = ECS.world.archetype("age", "maxAge")

export default () => {
  for (const entity of entities) {
    if (entity.age >= entity.maxAge) {
      ECS.world.queue.destroyEntity(entity)
    }
  }
}
