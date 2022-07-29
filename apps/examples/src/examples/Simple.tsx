import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { useMemo } from "react"
import { Vector3 } from "three"
import { Repeat } from "three-vfx"
import { Emitter, Particles } from "vfx-composer/fiber"
import { Velocity } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import textureUrl from "./textures/particle.png"

export const Simple = () => {
  const texture = useTexture(textureUrl)

  const inputs = useMemo(() => {
    const velocity = ParticleAttribute(
      "vec3",
      () => new Vector3(plusMinus(2), between(2, 8), plusMinus(2))
    )

    return {
      position: [Velocity(velocity)]
    }
  }, [])

  return (
    <Particles inputs={inputs}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />

      <Repeat interval={0.2}>
        <Emitter count={1} />
      </Repeat>
    </Particles>
  )
}
