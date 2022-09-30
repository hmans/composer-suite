import { GroupProps, useLoader } from "@react-three/fiber"
import { PositionalAudio } from "audio-composer"
import { flow } from "fp-ts/lib/function"
import { Composable, Modules } from "material-composer-r3f"
import { ModuleRegistrationContext } from "material-composer-r3f/src/moduleRegistration"
import { Module } from "module"
import { between, upTo } from "randomish"
import { useLayoutEffect } from "react"
import {
  Add,
  Mul,
  Normalize,
  Remap,
  ScaleAndOffset,
  Smoothstep,
  Vec3
} from "shader-composer"
import { rand } from "shader-composer-toybox/src/noise/random"
import { AudioLoader, Color } from "three"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, InstancedParticles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { ECS } from "../state"

const lifetime = createParticleLifetime()

export const AsteroidExplosions = () => {
  const random = InstanceRNG()

  const direction = ScaleAndOffset(
    Vec3([random(4), random(2), random(12)]),
    2,
    -1
  )

  return (
    <InstancedParticles>
      <sphereGeometry />

      <Composable.MeshBasicMaterial color="white">
        <Modules.Scale scale={ScaleAndOffset(random(16), 0.5, 0.1)} />
        <Modules.Scale scale={Smoothstep(1, 0.6, lifetime.progress)} />

        <Modules.Velocity direction={Mul(direction, 2)} time={lifetime.age} />
        <Modules.Acceleration
          direction={Mul(direction, -0.5)}
          time={lifetime.age}
        />

        <Modules.Color
          color={(v) => Mul(v, ScaleAndOffset(random(876), 5, 1.5))}
        />

        <Modules.Lifetime {...lifetime} />
      </Composable.MeshBasicMaterial>

      <ECS.ArchetypeEntities archetype={["asteroidExplosion"]}>
        {(entity) => entity.asteroidExplosion}
      </ECS.ArchetypeEntities>
    </InstancedParticles>
  )
}

export const AsteroidExplosion = (props: GroupProps) => (
  <group {...props}>
    <Emitter
      rate={Infinity}
      limit={between(10, 20)}
      setup={() => {
        lifetime.setLifetime(between(2, 5))
      }}
    />

    <PositionalAudio
      url="/sounds/explosion.wav"
      distance={5}
      autoplay
      loop={false}
    />
  </group>
)

export const spawnAsteroidExplosion = (props: GroupProps) =>
  ECS.world.createEntity({
    age: 0,
    destroyAfter: 5,
    asteroidExplosion: <AsteroidExplosion {...props} />
  })

useLoader.preload(AudioLoader, "/sounds/explosion.wav")
