import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { memo } from "react"
import { Mul, OneMinus, Vec3 } from "shader-composer"
import { Color } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, EmitterProps, InstancedParticles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { ECS } from "../state"

const lifetime = createParticleLifetime()

const SparksMaterial = memo(() => {
  const rng = InstanceRNG()
  const direction = Vec3([rng(12), rng(84), rng(1)])

  return (
    <Composable.MeshStandardMaterial>
      <Modules.Scale scale={OneMinus(lifetime.progress)} />
      <Modules.Velocity
        direction={Mul(direction, 5)}
        time={lifetime.age}
        space="local"
      />
      <Modules.Color color={new Color("yellow").multiplyScalar(2)} />
      <Modules.Lifetime {...lifetime} />
    </Composable.MeshStandardMaterial>
  )
})

export const Sparks = () => {
  const emitters = ECS.useArchetype("isSparks", "jsx").entities

  return (
    <InstancedParticles>
      <planeGeometry args={[0.1, 0.1]} />
      <SparksMaterial />
      <ECS.Entities entities={emitters}>{(entity) => entity.jsx!}</ECS.Entities>
    </InstancedParticles>
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
