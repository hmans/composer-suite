import { useTexture } from "@react-three/drei"
import { ComposableMaterial, Modules } from "material-composer-r3f"
import { between, plusMinus } from "randomish"
import { OneMinus } from "shader-composer"
import { AdditiveBlending, Vector3 } from "three"
import {
  Emitter,
  Particles,
  useParticleAttribute,
  useParticles
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

        <ComposableMaterial
          map={texture}
          depthWrite={false}
          blending={AdditiveBlending}
        >
          <Modules.Billboard />
          <Modules.Scale scale={OneMinus(particles.progress)} />
          <Modules.Velocity velocity={velocity} time={particles.age} />
          <Modules.Acceleration
            force={new Vector3(0, -2, 0)}
            time={particles.age}
          />
          <Modules.Lifetime {...particles} />
        </ComposableMaterial>

        {/* The other important component here is the emitter, which will, as you
        might already have guessed, emit new particles. Emitters are full scene
        objects, and the particles they spawn will inherit their transforms, but more
        importantly, we can define a callback function that will be invoked once for
        every new particle spawned, which gives us an opportunity to further
        customize each particle's behavior as needed. */}
        <Emitter
          rate={100}
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
