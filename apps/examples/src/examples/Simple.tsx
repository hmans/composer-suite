import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { Vector3 } from "three"
import { Repeat } from "three-vfx"
import { Emitter, Particles } from "vfx-composer/fiber"
import { Billboard, Gravity, Velocity } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import textureUrl from "./textures/particle.png"

const InstancedVec3 = (ctor: () => Vector3) => ParticleAttribute("vec3", ctor)

const modules = {
  position: [
    Billboard(),
    Velocity(
      InstancedVec3(
        () => new Vector3(plusMinus(5), between(5, 18), plusMinus(5))
      )
    ),
    Gravity()
  ]
}

export const Simple = () => {
  const texture = useTexture(textureUrl)

  return (
    <Particles maxParticles={100} modules={modules}>
      <planeGeometry />
      <meshStandardMaterial
        color="white"
        map={texture}
        alphaMap={texture}
        transparent
        depthWrite={false}
      />

      <Repeat interval={0.2}>
        <Emitter count={3} />
      </Repeat>
    </Particles>
  )
}
