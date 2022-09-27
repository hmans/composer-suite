import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { $, Input, InstanceID, Mul, OneMinus, Vec3 } from "shader-composer"
import { Random } from "shader-composer-toybox"
import { Vector3 } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, EmitterProps, Particles } from "vfx-composer-r3f"
import { ECS } from "../state"

const tmpVec3 = new Vector3()

const lifetime = createParticleLifetime()

export const Debris = () => {
  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)

  const direction = Vec3([random(12), random(84), random(1)])

  return (
    <Particles capacity={200}>
      <icosahedronGeometry args={[0.3]} />

      <Composable.meshStandardMaterial color="#666">
        <Modules.Scale scale={OneMinus(lifetime.progress)} />
        <Modules.Velocity
          direction={Mul(direction, 5)}
          time={lifetime.age}
          space="local"
        />
        <Modules.Color color={(c) => Mul(c, random(123))} />
        <Modules.Lifetime {...lifetime} />
      </Composable.meshStandardMaterial>

      <ECS.ManagedEntities tag="isDebris">
        {(entity) => entity.jsx!}
      </ECS.ManagedEntities>
    </Particles>
  )
}

export const DebrisEmitter = (props: EmitterProps) => (
  <Emitter
    {...props}
    rate={Infinity}
    limit={between(2, 5)}
    setup={({ position, scale }) => {
      scale.setScalar(between(0.5, 2))
      lifetime.setLifetime(between(0.5, 1.5), upTo(0.1))
      position.add(tmpVec3.randomDirection())
    }}
  />
)
