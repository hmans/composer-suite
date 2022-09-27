import { GroupProps, Object3DProps } from "@react-three/fiber"
import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { createContext, useContext } from "react"
import { $, Input, InstanceID, Mul, OneMinus, Vec3 } from "shader-composer"
import { Random } from "shader-composer-toybox"
import { Vector3 } from "three"
import { Emitter, Particles, useParticleLifetime } from "vfx-composer-r3f"
import { ECS } from "./state"

export const DebrisContext = createContext<{ particles: any }>(null!)

const tmpVec3 = new Vector3()

export const Debris = (props: GroupProps) => {
  const particles = useParticleLifetime()

  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)

  const direction = Vec3([random(12), random(84), random(1)])

  return (
    <group {...props}>
      <Particles capacity={200}>
        <icosahedronGeometry args={[0.3]} />

        <Composable.meshStandardMaterial color="#666">
          <Modules.Scale scale={OneMinus(particles.progress)} />
          <Modules.Velocity
            direction={Mul(direction, 5)}
            time={particles.age}
            space="local"
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

export const DebrisEmitter = (props: Object3DProps) => {
  const { particles } = useContext(DebrisContext)

  return (
    <Emitter
      {...props}
      rate={Infinity}
      limit={between(2, 5)}
      setup={({ position, scale }) => {
        scale.setScalar(between(0.5, 2))
        particles.setLifetime(between(0.5, 1.5), upTo(0.1))
        position.add(tmpVec3.randomDirection())
      }}
    />
  )
}
