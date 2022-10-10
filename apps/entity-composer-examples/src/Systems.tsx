import { useFrame } from "@react-three/fiber"
import { useBucket } from "entity-composer/react"
import { withTransform } from "./state"

export const Systems = () => {
  useBucket(withTransform)

  useFrame((_, dt) => {
    for (const { transform } of withTransform.entities) {
      transform.rotation.x = transform.rotation.y += 2 * dt
    }
  })

  return null
}
