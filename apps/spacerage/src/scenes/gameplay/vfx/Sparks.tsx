import { Composable, Layer, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { memo } from "react"
import { Mix, Mul, OneMinus, Vec3 } from "shader-composer"
import { Color } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, EmitterProps, InstancedParticles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { ECS } from "../state"

const lifetime = createParticleLifetime()

const SparksLayer = () => {
  const rng = InstanceRNG()

  const direction = Vec3([
    Mix(-0.5, 0.5, rng(12)),
    Mul(rng(84), -1),
    Mix(-0.5, 0.5, rng(1))
  ])

  return (
    <Layer>
      <Modules.Scale scale={OneMinus(lifetime.progress)} />
      <Modules.Velocity
        direction={Mul(direction, 5)}
        time={lifetime.age}
        space="local"
      />
      <Modules.Color color={new Color("yellow").multiplyScalar(4)} />
      <Modules.Lifetime {...lifetime} />
    </Layer>
  )
}

const SparksMaterial = memo(() => (
  <Composable.MeshStandardMaterial>
    <SparksLayer />
  </Composable.MeshStandardMaterial>
))

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
