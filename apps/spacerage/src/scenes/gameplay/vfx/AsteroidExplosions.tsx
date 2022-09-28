import { GroupProps } from "@react-three/fiber"
import { between, upTo } from "randomish"
import { useLayoutEffect } from "react"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, InstancedParticles } from "vfx-composer-r3f"
import { PositionalAudio } from "../../../lib/PositionalAudio"
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

export const AsteroidExplosion = (props: GroupProps) => {
  useLayoutEffect(() => {
    console.log("hellO!")
    return () => console.log("bye!")
  }, [])

  return (
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
}

export const spawnAsteroidExplosion = (props: GroupProps) =>
  ECS.world.createEntity({
    age: 0,
    destroyAfter: 5,
    asteroidExplosion: <AsteroidExplosion {...props} />
  })
