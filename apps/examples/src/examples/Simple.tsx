import { useTexture } from "@react-three/drei"
import { useMemo } from "react"
import { Emitter, Particles } from "vfx-composer"
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

      <Emitter count={1} />
    </Particles>
  )
}
