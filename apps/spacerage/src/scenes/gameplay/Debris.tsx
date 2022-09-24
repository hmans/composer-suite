import { GroupProps } from "@react-three/fiber"
import { Composable, Modules } from "material-composer-r3f"
import { Vector3 } from "three"
import { Emitter, Particles, useParticles } from "vfx-composer-r3f"

export const Debris = (props: GroupProps) => {
  const particles = useParticles()

  return (
    <group {...props}>
      <Particles capacity={1000}>
        <planeGeometry />

        <Composable.meshStandardMaterial color="white">
          <Modules.Velocity
            direction={new Vector3(0, 10, 0)}
            time={particles.age}
          />
          {/* <Modules.Lifetime {...particles} /> */}
        </Composable.meshStandardMaterial>

        <Emitter
          rate={10}
          limit={Infinity}
          setup={({ position }) => {
            particles.setLifetime(3)
            position.randomDirection()
          }}
        />
      </Particles>
    </group>
  )
}
