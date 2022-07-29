import { useTexture } from "@react-three/drei"
import { useMemo } from "react"
import { Vector3 } from "three"
import { Repeat } from "three-vfx"
import { Emitter, Particles } from "vfx-composer/fiber"
import { Translate } from "vfx-composer/modules"
import textureUrl from "./textures/particle.png"

export const Simple = () => {
  const texture = useTexture(textureUrl)

  const inputs = useMemo(() => {
    return {
      position: [Translate(new Vector3(0, 0, 0))]
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
