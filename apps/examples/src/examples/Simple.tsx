import { useTexture } from "@react-three/drei"
import { between, chance, plusMinus } from "randomish"
import { OneMinus } from "shader-composer"
import { Color, Vector3 } from "three"
import { Repeat } from "three-vfx"
import { Emitter, Particles } from "vfx-composer/fiber"
import {
  Billboard,
  Gravity,
  Scale,
  SetColor,
  Velocity
} from "vfx-composer/modules"
import { ParticleAttribute, ParticleProgress } from "vfx-composer/units"
import textureUrl from "./textures/particle.png"

export const Simple = () => {
  const texture = useTexture(textureUrl)

  const variables = {
    velocity: ParticleAttribute("vec3"),

    color: ParticleAttribute("vec3")
  }

  return (
    <Particles
      /* How many particles in this effect? If we spawn more, old particles
      will be recycled. */
      maxParticles={100}
      /* Particle effects will accept an array of animation modules defining
      the behavior of each particle. */
      modules={[
        /* We're using a plane geometry with a texture, so let's billboard it. */
        Billboard(),

        /* Let's animate scale linearly according to the particle's progress (0-1). */
        Scale(OneMinus(ParticleProgress)),

        /* Let's simulate velocity! We want each particle to have its own velocity,
        so we'll create one randomly. */
        Velocity(variables.velocity),

        /* Let's simulate gravity. */
        Gravity(),

        /* Finally, let's do something with colors. We want each particle to have its
        own color, so let's pick between two of them randomly. */
        SetColor(variables.color)
      ]}
    >
      {/* Particle effects can use any geometry... */}
      <planeGeometry />

      {/* ...and any material. */}
      <meshStandardMaterial
        color="white"
        map={texture}
        alphaMap={texture}
        transparent
        depthWrite={false}
      />

      {/* Finally, emit some particles! */}
      <Repeat interval={0.1}>
        <Emitter
          count={5}
          setup={(imesh, index) => {
            variables.velocity.setupParticle(
              imesh,
              index,
              () => new Vector3(plusMinus(5), between(5, 18), plusMinus(5))
            )

            variables.color.setupParticle(imesh, index, () =>
              chance(0.5) ? new Color(0xffffff) : new Color(0x000000)
            )
          }}
        />
      </Repeat>
    </Particles>
  )
}
