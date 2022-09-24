import { GroupProps } from "@react-three/fiber"
import { Composable, Modules } from "material-composer-r3f"
import { $, Float, Input, InstanceID, Vec3 } from "shader-composer"
import { Random } from "shader-composer-toybox"
import { Vector3 } from "three"
import { Emitter, Particles, useParticles } from "vfx-composer-r3f"

export const Debris = (props: GroupProps) => {
  const particles = useParticles()

  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)

  const direction = Vec3([random(12), random(84), random(1)])

  return (
    <group {...props}>
      <Particles capacity={1000}>
        <planeGeometry />

        <Composable.meshStandardMaterial color="white">
          <Modules.Velocity direction={direction} time={particles.age} />
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
