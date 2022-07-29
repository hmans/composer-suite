import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { OneMinus } from "shader-composer"
import { Vector3 } from "three"
import { Repeat } from "three-vfx"
import { Emitter, Particles } from "vfx-composer/fiber"
import { Billboard, Gravity, Scale, Velocity } from "vfx-composer/modules"
import { ParticleAttribute, ParticleProgress } from "vfx-composer/units"
import textureUrl from "./textures/particle.png"

const InstancedVec3 = (ctor: () => Vector3) => ParticleAttribute("vec3", ctor)

export const Simple = () => {
  const texture = useTexture(textureUrl)

  return (
    <Particles
      maxParticles={100}
      modules={[
        Billboard(),
        Scale(OneMinus(ParticleProgress)),
        Velocity(
          InstancedVec3(
            () => new Vector3(plusMinus(5), between(5, 18), plusMinus(5))
          )
        ),
        Gravity()
      ]}
    >
      <planeGeometry />
      <meshStandardMaterial
        color="white"
        map={texture}
        alphaMap={texture}
        transparent
        depthWrite={false}
      />

      <Repeat interval={0.1}>
        <Emitter count={5} />
      </Repeat>
    </Particles>
  )
}
