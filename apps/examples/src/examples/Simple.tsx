import { useTexture } from "@react-three/drei"
import { between, chance, plusMinus } from "randomish"
import { OneMinus } from "shader-composer"
import { Color, Vector3 } from "three"
import { Repeat } from "three-vfx"
import { Emitter, Particles } from "vfx-composer/fiber"
import { DefaultModules } from "vfx-composer/modules"
import { ParticleAttribute, ParticleProgress } from "vfx-composer/units"
import textureUrl from "./textures/particle.png"

export const Simple = () => {
  const texture = useTexture(textureUrl)

  const variables = {
    velocity: ParticleAttribute("vec3", () => new Vector3()),
    color: ParticleAttribute("vec3", () => new Color())
  }

  return (
    <Particles
      maxParticles={100}
      modules={DefaultModules({
        velocity: variables.velocity,
        color: variables.color,
        scale: OneMinus(ParticleProgress)
      })}
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
        <Emitter
          count={5}
          setup={(mesh, index) => {
            variables.velocity.setupParticle(mesh, index, (v) =>
              v.set(plusMinus(5), between(5, 18), plusMinus(5))
            )

            variables.color.setupParticle(mesh, index, (c) =>
              c.set(chance(0.5) ? 0xffffff : 0x000000)
            )
          }}
        />
      </Repeat>
    </Particles>
  )
}
