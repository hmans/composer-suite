import ECS from "../ECS"

export default () => {
  ECS.world.queue.flush()
}
