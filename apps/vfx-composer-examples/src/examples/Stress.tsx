import { composable, modules } from "material-composer-r3f"
import { between, plusMinus, upTo } from "randomish"
import { OneMinus } from "@shader-composer/three"
import { Color, Vector3 } from "three"
import {
  Emitter,
  InstancedParticles,
  useParticleAttribute,
  useParticleLifetime
} from "vfx-composer-r3f"

export const Stress = () => {
  const lifetime = useParticleLifetime()
  const velocity = useParticleAttribute(() => new Vector3())
  const color = useParticleAttribute(() => new Color())

  return (
    <group>
      <InstancedParticles capacity={1_000_000} safetyCapacity={50_000}>
        <planeGeometry args={[0.1, 0.1]} />

        <composable.meshStandardMaterial>
          <modules.Scale scale={OneMinus(lifetime.progress)} />

          <modules.Velocity direction={velocity} time={lifetime.age} />

          <modules.Acceleration
            direction={new Vector3(0, -10, 0)}
            time={lifetime.age}
          />

          <modules.Color color={color} />
          <modules.Lifetime {...lifetime} />
        </composable.meshStandardMaterial>

        <Emitter
          rate={100_000}
          setup={({ mesh, position, rotation }) => {
            /* Randomize the instance transform */
            position.randomDirection().multiplyScalar(upTo(1))
            rotation.random()

            /* Write values into the instanced attributes */
            lifetime.write(mesh, between(1, 3))
            velocity.write(mesh, (v) =>
              v.set(plusMinus(2), between(2, 8), plusMinus(2))
            )
            color.write(mesh, (v) => v.setScalar(Math.random() * 2))
          }}
        />
      </InstancedParticles>
    </group>
  )
}
