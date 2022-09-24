import { useFrame } from "@react-three/fiber"
import { Stage } from "../../../configuration"
import { ECS } from "../state"

export const ECSFlushSystem = () => {
  useFrame(() => {
    ECS.world.queue.flush()
  }, Stage.Late)

  return null
}
