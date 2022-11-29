import { useTexture } from "@react-three/drei"
import { composable, modules } from "material-composer-r3f"
import { FlatStage } from "r3f-stage"
import { between, plusMinus } from "randomish"
import { OneMinus } from "@shader-composer/three"
import { AdditiveBlending, Vector3 } from "three"
import {
  Emitter,
  InstancedParticles,
  useParticleAttribute,
  useParticleLifetime
} from "vfx-composer-r3f"
import { particleUrl } from "./textures"

export const Simple = () => {
  const texture = useTexture(particleUrl)
  const lifetime = useParticleLifetime()
  const velocity = useParticleAttribute(() => new Vector3())

  return (
    <FlatStage>
      {/* All particle effects are driven by instances of <InstancedParticles>. */}
      <InstancedParticles>
        {/* Any geometry can be used, but here, we'll go with something simple. */}
        <planeGeometry args={[0.2, 0.2]} />

        <composable.meshStandardMaterial
          map={texture}
          depthWrite={false}
          blending={AdditiveBlending}
        >
          <modules.Billboard />
          <modules.Scale scale={OneMinus(lifetime.progress)} />
          <modules.Velocity direction={velocity} time={lifetime.age} />
          <modules.Acceleration
            direction={new Vector3(0, -2, 0)}
            time={lifetime.age}
          />
          <modules.Lifetime progress={lifetime.progress} />
        </composable.meshStandardMaterial>

        {/* The other important component here is the emitter, which will, as you
        might already have guessed, emit new particles. Emitters are full scene
        objects, and the particles they spawn will inherit their transforms, but more
        importantly, we can define a callback function that will be invoked once for
        every new particle spawned, which gives us an opportunity to further
        customize each particle's behavior as needed. */}
        <Emitter
          rate={100}
          setup={({ mesh }) => {
            /* Set a particle lifetime: */
            lifetime.write(mesh, between(1, 3))

            /* Let's configure a per-particle velocity! */
            velocity.write(mesh, (v) =>
              v.set(plusMinus(1), between(1, 3), plusMinus(1))
            )
          }}
        />
      </InstancedParticles>
    </FlatStage>
  )
}
