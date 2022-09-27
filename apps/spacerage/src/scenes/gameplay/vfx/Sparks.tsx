import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { Mul, OneMinus, Vec3 } from "shader-composer"
import { Color } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, EmitterProps, Particles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { ECS } from "../state"

const lifetime = createParticleLifetime()

export const Sparks = () => {
  const rng = InstanceRNG()

  const direction = Vec3([rng(12), rng(84), rng(1)])

  return (
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
  )
}

export const SparksEmitter = (props: EmitterProps) => (
  <Emitter
    {...props}
    rate={Infinity}
    limit={between(2, 8)}
    setup={() => {
      lifetime.setLifetime(between(0.2, 0.8), upTo(0.1))
    }}
  />
)
