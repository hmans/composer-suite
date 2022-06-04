import ECS from "../ECS"

const { entities } = ECS.world.archetype("age")

export default (dt: number) => {
  for (const entity of entities) {
    entity.age += dt
  }
}
