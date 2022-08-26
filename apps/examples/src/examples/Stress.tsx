import { ComposableMaterial, Modules } from "material-composer-r3f"
import { between, plusMinus, random, upTo } from "randomish"
import { OneMinus } from "shader-composer"
import { Color, Vector3 } from "three"
import { Repeat } from "timeline-composer"
import {
  makeParticles,
  useParticleAttribute,
  useParticles
} from "vfx-composer-r3f"
import { WorldToInstanceSpace } from "./lib/WorldToInstanceSpace"

const Effect = makeParticles()

const FREQ = 30

export const Stress = () => {
  const particles = useParticles()
  const velocity = useParticleAttribute(() => new Vector3())
  const color = useParticleAttribute(() => new Color())

  return (
    <group>
      <Effect.Root maxParticles={1_000_000} safetyBuffer={1_000}>
        <planeGeometry args={[0.1, 0.1]} />

        <ComposableMaterial>
          <Modules.Scale scale={OneMinus(particles.progress)} />

          <Modules.Velocity
            velocity={WorldToInstanceSpace(velocity)}
            time={particles.age}
          />

          <Modules.Acceleration
            force={WorldToInstanceSpace(new Vector3(0, -10, 0))}
            time={particles.age}
          />

          <Modules.Color color={color} />
          <Modules.Lifetime {...particles} />
        </ComposableMaterial>
      </Effect.Root>

      <Repeat seconds={1 / FREQ}>
        <Effect.Emitter
          count={100_000 / FREQ}
          setup={({ position, rotation }) => {
            const t = particles.time.value

            /* Randomize the instance transform */
            position.randomDirection().multiplyScalar(upTo(1))
            rotation.random()

            /* Write values into the instanced attributes */
            const start = t + random() / FREQ
            particles.setLifetime(between(1, 3))
            velocity.value.set(plusMinus(2), between(2, 8), plusMinus(2))
            color.value.setScalar(Math.random() * 2)
          }}
        />
      </Repeat>
    </group>
  )
}
