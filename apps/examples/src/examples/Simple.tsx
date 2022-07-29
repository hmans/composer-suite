import { useTexture } from "@react-three/drei"
import { useMemo } from "react"
import { Particles } from "vfx-composer"
import textureUrl from "./textures/particle.png"

export const Simple = () => {
  const texture = useTexture(textureUrl)

  const inputs = useMemo(() => {
    return {}
  }, [])

  return (
    <Particles inputs={inputs}>
      <boxGeometry />
      <meshStandardMaterial />
    </Particles>
  )
}
