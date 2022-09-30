import { GroupProps, useLoader } from "@react-three/fiber"
import { PositionalAudio } from "audio-composer"
import { useLayoutEffect } from "react"
import { AudioLoader } from "three"
import { createParticleLifetime } from "vfx-composer"
import { InstancedParticles } from "vfx-composer-r3f"
import { ECS } from "../state"

const lifetime = createParticleLifetime()

export const AsteroidExplosions = () => {
  return (
    <InstancedParticles>
      <planeGeometry args={[0.1, 0.1]} />

      <ECS.ArchetypeEntities archetype={["asteroidExplosion"]}>
        {(entity) => entity.asteroidExplosion}
      </ECS.ArchetypeEntities>
    </InstancedParticles>
  )
}

export const AsteroidExplosion = (props: GroupProps) => (
  <group {...props}>
    {/* <Emitter
        rate={Infinity}
        limit={between(2, 8)}
        setup={() => {
          lifetime.setLifetime(between(0.2, 0.8), upTo(0.1))
        }}
      /> */}

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
