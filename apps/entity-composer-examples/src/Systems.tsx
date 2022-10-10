import { useFrame } from "@react-three/fiber"
import { withTransform } from "./state"

export const Systems = () => {
  useFrame((_, dt) => {
    for (const { transform } of withTransform.entities) {
      transform.rotation.x = transform.rotation.y += 2 * dt
    }
  })

  return null
}
