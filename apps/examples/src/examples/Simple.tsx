import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { useMemo } from "react"
import { Mul } from "shader-composer"
import { Vector3 } from "three"
import { Repeat } from "three-vfx"
import { Emitter, Particles } from "vfx-composer/fiber"
import { Translate } from "vfx-composer/modules"
import { ParticleAge, ParticleAttribute } from "vfx-composer/units"
import textureUrl from "./textures/particle.png"

export const Simple = () => {
  const texture = useTexture(textureUrl)

  const inputs = useMemo(() => {
    const velocity = ParticleAttribute(
      "vec3",
      () => new Vector3(plusMinus(2), between(2, 8), plusMinus(2))
    )

    return {
      position: [Translate(Mul(velocity, ParticleAge))]
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
