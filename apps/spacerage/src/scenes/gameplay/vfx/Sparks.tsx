import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { Mix, Mul, OneMinus, Vec3 } from "shader-composer"
import { Color } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, EmitterProps, InstancedParticles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { PositionalAudio } from "../../../lib/PositionalAudio"
import { ECS } from "../state"

const lifetime = createParticleLifetime()

export const Sparks = () => {
  const rng = InstanceRNG()

  const direction = Vec3([
    Mix(-0.5, 0.5, rng(12)),
    Mul(rng(84), -1),
    Mix(-0.5, 0.5, rng(1))
  ])

  return (
    <InstancedParticles>
      <planeGeometry args={[0.1, 0.1]} />

      {/* A composable material that animates the sparks */}
      <Composable.MeshStandardMaterial>
        <Modules.Scale scale={OneMinus(lifetime.progress)} />
        <Modules.Velocity
          direction={Mul(direction, 5)}
          time={lifetime.age}
          space="local"
        />
        <Modules.Color color={new Color("yellow").multiplyScalar(4)} />
        <Modules.Lifetime {...lifetime} />
      </Composable.MeshStandardMaterial>

      {/* Render all the sparks entities */}
      <ECS.ArchetypeEntities archetype={["isSparks", "jsx"]}>
        {(entity) => entity.jsx}
      </ECS.ArchetypeEntities>
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
  >
    <PositionalAudio
      url="/sounds/blurp2.wav"
      volume={0.1}
      distance={10}
      autoplay
      loop={false}
    />
  </Emitter>
)

export const spawnSparks = (props: EmitterProps) =>
  ECS.world.createEntity({
    isSparks: true,
    age: 0,
    destroyAfter: 3,

    jsx: <SparksEmitter {...props} />
  })
