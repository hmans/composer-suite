import { useFrame } from "@react-three/fiber"
import { useBucket } from "bucketeer/react"
import { withTransform } from "./state"

export const Systems = () => {
  const { entities } = useBucket(withTransform)

  useFrame((_, dt) => {
    for (const { transform } of entities) {
      transform.rotation.x = transform.rotation.y += 2 * dt
    }
  })

  return null
}
