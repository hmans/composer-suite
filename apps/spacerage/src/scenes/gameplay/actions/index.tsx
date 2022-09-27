import { Quaternion, Vector3 } from "three"
import { Particle } from "vfx-composer-r3f"
import { ECS } from "../state"
import { DebrisEmitter } from "../vfx/Debris"
import { SparksEmitter } from "../vfx/Sparks"

export const spawnAsteroid = (position: Vector3, scale: number = 1) => {
  ECS.world.createEntity({
    asteroid: {
      spawnPosition: position,
      scale
    },
    health: 100 * scale
  })
}

export const spawnBullet = (
  position: Vector3,
  quaternion: Quaternion,
  velocity: Vector3
) => {
  ECS.world.createEntity({
    isBullet: true,
    age: 0,
    destroyAfter: 1,
    velocity,

    jsx: (
      <ECS.Component name="sceneObject">
        <Particle
          position={position}
          quaternion={quaternion}
          matrixAutoUpdate
        />
      </ECS.Component>
    )
  })
}

export const spawnSparks = (position: Vector3, quaternion: Quaternion) => {
  ECS.world.createEntity({
    isSparks: true,
    age: 0,
    destroyAfter: 3,

    jsx: <SparksEmitter position={position} quaternion={quaternion} />
  })
}

export const spawnDebris = (position: Vector3, quaternion: Quaternion) => {
  ECS.world.createEntity({
    isDebris: true,
    age: 0,
    destroyAfter: 3,

    jsx: <DebrisEmitter position={position} quaternion={quaternion} />
  })
}
