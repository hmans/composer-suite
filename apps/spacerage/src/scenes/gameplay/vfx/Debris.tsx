import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { memo } from "react"
import { Mul, OneMinus, Vec3 } from "shader-composer"
import { Vector3 } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, EmitterProps, InstancedParticles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { ECS } from "../state"

const tmpVec3 = new Vector3()

const lifetime = createParticleLifetime()

const DebrisMaterial = memo(() => {
  const rng = InstanceRNG()
  const direction = Vec3([rng(12), rng(84), rng(1)])

  return (
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
  )
})

export const Debris = () => {
  return (
    <InstancedParticles capacity={200}>
      <icosahedronGeometry args={[0.3]} />
      <DebrisMaterial />

      <ECS.ArchetypeEntities archetype="debris">
        {({ debris }) => debris}
      </ECS.ArchetypeEntities>
    </InstancedParticles>
  )
}

export const DebrisEmitter = (props: EmitterProps) => (
  <Emitter
    {...props}
    rate={Infinity}
    limit={between(2, 5)}
    setup={({ mesh, position, scale }) => {
      scale.setScalar(between(0.5, 2))
      lifetime.write(mesh, between(0.5, 1.5), upTo(0.1))
      position.add(tmpVec3.randomDirection())
    }}
  />
)
