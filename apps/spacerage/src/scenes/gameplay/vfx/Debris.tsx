import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { Mul, OneMinus, Vec3 } from "shader-composer"
import { Vector3 } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, EmitterProps, InstancedParticles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { ECS } from "../state"

const tmpVec3 = new Vector3()

const lifetime = createParticleLifetime()

export const Debris = () => {
  const rng = InstanceRNG()

  const direction = Vec3([rng(12), rng(84), rng(1)])

  return (
    <InstancedParticles capacity={200}>
      <icosahedronGeometry args={[0.3]} />

      <Composable.meshStandardMaterial color="#666">
        <Modules.Scale scale={OneMinus(lifetime.progress)} />
        <Modules.Velocity
          direction={Mul(direction, 5)}
          time={lifetime.age}
          space="local"
        />
        <Modules.Color color={(c) => Mul(c, rng(123))} />
        <Modules.Lifetime {...lifetime} />
      </Composable.meshStandardMaterial>

      <ECS.ManagedEntities tag="isDebris">
        {(entity) => entity.jsx!}
      </ECS.ManagedEntities>
    </InstancedParticles>
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
