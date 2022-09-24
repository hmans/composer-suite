import { GroupProps } from "@react-three/fiber"
import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { $, Input, InstanceID, Mul, OneMinus, Vec3 } from "shader-composer"
import { Random } from "shader-composer-toybox"
import { InstanceSetupCallback } from "vfx-composer"
import { Emitter, Particles, useParticles } from "vfx-composer-r3f"

export const Debris = (props: GroupProps) => {
  const particles = useParticles()

  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)

  const direction = Vec3([random(12), random(84), random(1)])

  const setupDebris: InstanceSetupCallback = ({ position }) => {
    particles.setLifetime(between(0.5, 1.5), upTo(0.1))
    position.randomDirection()
  }

  return (
    <group {...props}>
      <Particles capacity={100}>
        <planeGeometry args={[0.3, 0.3]} />

        <Composable.meshStandardMaterial color="#666">
          <Modules.Scale scale={OneMinus(particles.progress)} />
          <Modules.Velocity
            direction={Mul(direction, 5)}
            time={particles.age}
          />
          <Modules.Color color={(c) => Mul(c, random(123))} />
          <Modules.Lifetime {...particles} />
        </Composable.meshStandardMaterial>

        <Emitter rate={Infinity} limit={between(5, 12)} setup={setupDebris} />
      </Particles>
    </group>
  )
}
