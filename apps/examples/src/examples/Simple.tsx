import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { useMemo } from "react"
import { Vector3 } from "three"
import { Repeat } from "three-vfx"
import { Emitter, Particles } from "vfx-composer/fiber"
import { Billboard, Gravity, Velocity } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import textureUrl from "./textures/particle.png"

export const Simple = () => {
  const texture = useTexture(textureUrl)

  const inputs = useMemo(() => {
    const velocity = ParticleAttribute(
      "vec3",
      () => new Vector3(plusMinus(5), between(5, 18), plusMinus(5))
    )

    return {
      position: [Velocity(velocity), Gravity(), Billboard()]
    }
  }, [])

  return (
    <Particles maxParticles={100} inputs={inputs}>
      <planeGeometry />
      <meshStandardMaterial color="cyan" map={texture} transparent />

      <Repeat interval={0.2}>
        <Emitter count={5} />
      </Repeat>
    </Particles>
  )
}
