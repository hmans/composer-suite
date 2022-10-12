import { useFrame } from "@react-three/fiber"
import { archetype } from "bucketeer"
import { useBucket } from "bucketeer/react"
import { world } from "./state"

const withTransform = world.derive(archetype("transform"))

export const Systems = () => {
  const { entities } = useBucket(withTransform)

  useFrame((_, dt) => {
    for (const { transform } of entities) {
      transform.rotation.x = transform.rotation.y += 2 * dt
    }
  })

  return null
}
