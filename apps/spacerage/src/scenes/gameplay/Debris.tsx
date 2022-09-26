import { GroupProps } from "@react-three/fiber"
import { Composable, Modules } from "material-composer-r3f"
import { createContext } from "react"
import { $, Input, InstanceID, Mul, OneMinus, Vec3 } from "shader-composer"
import { Random } from "shader-composer-toybox"
import { Particles, useParticles } from "vfx-composer-r3f"
import { ECS } from "./state"

export const DebrisContext = createContext<{ particles: any }>(null!)

export const Debris = (props: GroupProps) => {
  const particles = useParticles()

  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)

  const direction = Vec3([random(12), random(84), random(1)])

  return (
    <group {...props}>
      <Particles capacity={1000}>
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

        <DebrisContext.Provider value={{ particles }}>
          <ECS.ManagedEntities tag="isDebris">
            {(entity) => entity.jsx!}
          </ECS.ManagedEntities>
        </DebrisContext.Provider>
      </Particles>
    </group>
  )
}
