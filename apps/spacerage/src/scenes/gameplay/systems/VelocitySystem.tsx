import { useFrame } from "@react-three/fiber"
import { Stage } from "../../../configuration"
import { ECS } from "../state"

export const VelocitySystem = () => {
  const entities = ECS.world.archetype("sceneObject", "velocity")

  useFrame((_, dt) => {
    for (const { sceneObject, velocity } of entities) {
      sceneObject.position.addScaledVector(velocity, dt)
    }
  }, Stage.Early)

  return null
}
