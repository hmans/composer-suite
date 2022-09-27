import { GroupProps, Object3DProps } from "@react-three/fiber"
import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { $, Input, InstanceID, Mul, OneMinus, Vec3 } from "shader-composer"
import { Random } from "shader-composer-toybox"
import { Color } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, Particles } from "vfx-composer-r3f"
import { ECS } from "./state"

const lifetime = createParticleLifetime()

export const Sparks = (props: GroupProps) => {
  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)

  const direction = Vec3([random(12), random(84), random(1)])

  return (
    <group {...props}>
      <Particles capacity={200}>
        <planeGeometry args={[0.1, 0.1]} />

        <Composable.meshStandardMaterial>
          <Modules.Scale scale={OneMinus(lifetime.progress)} />
          <Modules.Velocity
            direction={Mul(direction, 5)}
            time={lifetime.age}
            space="local"
          />
          <Modules.Color color={new Color("yellow").multiplyScalar(2)} />
          <Modules.Lifetime {...lifetime} />
        </Composable.meshStandardMaterial>

        <ECS.ManagedEntities tag="isSparks">
          {(entity) => entity.jsx!}
        </ECS.ManagedEntities>
      </Particles>
    </group>
  )
}

export const SparksEmitter = (props: Object3DProps) => (
  <Emitter
    {...props}
    rate={Infinity}
    limit={between(2, 8)}
    setup={() => {
      lifetime.setLifetime(between(0.2, 0.8), upTo(0.1))
    }}
  />
)
