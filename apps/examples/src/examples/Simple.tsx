import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { OneMinus } from "shader-composer"
import { AdditiveBlending, MeshStandardMaterial, Vector3 } from "three"
import {
  Emitter,
  Particles,
  useParticleAttribute,
  useParticles,
  VFX,
  VFXMaterial
} from "vfx-composer-r3f"
import { particleUrl } from "./textures"

export const Simple = () => {
  const texture = useTexture(particleUrl)
  const particles = useParticles()
  const velocity = useParticleAttribute(() => new Vector3())

  return (
    <group>
      {/* All particle effects are driven my instances of <Particles>. */}
      <Particles maxParticles={1_000} safetyBuffer={1_000}>
        {/* Any geometry can be used, but here, we'll go with something simple. */}
        <planeGeometry args={[0.2, 0.2]} />

        {/* The main driver of everything VFX Composer does is VFXMaterial, which
        will compile a list of animation modules into one big shader so things can
        happily run on your GPU. Try commenting out some of these to see what happens! */}
        <VFXMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          depthWrite={false}
          blending={AdditiveBlending}
        >
          <VFX.Billboard />
          <VFX.Scale scale={OneMinus(particles.Progress)} />
          <VFX.Velocity velocity={velocity} time={particles.Age} />
          <VFX.Acceleration
            force={new Vector3(0, -2, 0)}
            time={particles.Age}
          />
          <VFX.Particles {...particles} />
        </VFXMaterial>

        {/* The other important component here is the emitter, which will, as you
        might already have guessed, emit new particles. Emitters are full scene
        objects, and the particles they spawn will inherit their transforms, but more
        importantly, we can define a callback function that will be invoked once for
        every new particle spawned, which gives us an opportunity to further
        customize each particle's behavior as needed. */}
        <Emitter
          continuous
          setup={() => {
            /* Set a particle lifetime: */
            particles.setLifetime(between(1, 3))

            /* Let's configure a per-particle velocity! */
            velocity.value.set(plusMinus(1), between(1, 3), plusMinus(1))
          }}
        />
      </Particles>
    </group>
  )
}
