import { GroupProps } from "@react-three/fiber"
import { Composable, Modules } from "material-composer-r3f"
import { createContext } from "react"
import { $, Input, InstanceID, Mul, OneMinus, Vec3 } from "shader-composer"
import { Random } from "shader-composer-toybox"
import { Color } from "three"
import { Particles, useParticleLifetime } from "vfx-composer-r3f"
import { ECS } from "./state"

export const SparksContext = createContext<{ particles: any }>(null!)

export const Sparks = (props: GroupProps) => {
  const particles = useParticleLifetime()

  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)

  const direction = Vec3([random(12), random(84), random(1)])

  return (
    <group {...props}>
      <Particles capacity={200}>
        <planeGeometry args={[0.1, 0.1]} />

        <Composable.meshStandardMaterial>
          <Modules.Scale scale={OneMinus(particles.progress)} />
          <Modules.Velocity
            direction={Mul(direction, 5)}
            time={particles.age}
            space="local"
          />
          <Modules.Color color={new Color("yellow").multiplyScalar(2)} />
          <Modules.Lifetime {...particles} />
        </Composable.meshStandardMaterial>

        <SparksContext.Provider value={{ particles }}>
          <ECS.ManagedEntities tag="isSparks">
            {(entity) => entity.jsx!}
          </ECS.ManagedEntities>
        </SparksContext.Provider>
      </Particles>
    </group>
  )
}
