import { composable, modules } from "material-composer-r3f"
import { between, plusMinus, upTo } from "randomish"
import { OneMinus } from "shader-composer"
import { Color, Vector3 } from "three"
import {
  makeParticles,
  useParticleAttribute,
  useParticles
} from "vfx-composer-r3f"

const Effect = makeParticles()

export const Stress = () => {
  const particles = useParticles()
  const velocity = useParticleAttribute(() => new Vector3())
  const color = useParticleAttribute(() => new Color())

  return (
    <group>
      <Effect.Root capacity={1_000_000} safetyBuffer={1_000}>
        <planeGeometry args={[0.1, 0.1]} />

        <composable.meshStandardMaterial>
          <modules.Scale scale={OneMinus(particles.progress)} />

          <modules.Velocity velocity={velocity} time={particles.age} />

          <modules.Acceleration
            force={new Vector3(0, -10, 0)}
            time={particles.age}
          />

          <modules.Color color={color} />
          <modules.Lifetime {...particles} />
        </composable.meshStandardMaterial>
      </Effect.Root>

      <Effect.Emitter
        rate={100_000}
        setup={({ position, rotation }) => {
          const t = particles.time.value

          /* Randomize the instance transform */
          position.randomDirection().multiplyScalar(upTo(1))
          rotation.random()

          /* Write values into the instanced attributes */
          particles.setLifetime(between(1, 3))
          velocity.value.set(plusMinus(2), between(2, 8), plusMinus(2))
          color.value.setScalar(Math.random() * 2)
        }}
      />
    </group>
  )
}
