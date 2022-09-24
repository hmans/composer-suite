import { useFrame } from "@react-three/fiber"
import { Stage } from "../../../configuration"
import { ECS } from "../state"

export const AgeSystem = () => {
  const entities = ECS.world.archetype("age")

  useFrame((_, dt) => {
    for (const entity of entities) {
      entity.age += dt
    }
  }, Stage.Early)

  return null
}
