import { useTexture } from "@react-three/drei"
import { useMemo } from "react"
import { Add, Time, VertexPosition } from "shader-composer"
import { Repeat } from "three-vfx"
import { ParticleAge } from "vfx-composer"
import { Particles, Emitter } from "vfx-composer/fiber"
import textureUrl from "./textures/particle.png"

export const Simple = () => {
  const texture = useTexture(textureUrl)

  const inputs = useMemo(() => {
    return {
      position: Add(VertexPosition, ParticleAge)
    }
  }, [])

  return (
    <Particles inputs={inputs}>
      <boxGeometry />
      <meshStandardMaterial />

      <Repeat interval={0.2}>
        <Emitter count={1} />
      </Repeat>
    </Particles>
  )
}
