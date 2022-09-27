import { Color, Quaternion, Vector3 } from "three"
import { DebrisEmitter } from "./vfx/Debris"
import { SparksEmitter } from "./vfx/Sparks"
import { ECS } from "./state"

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
      <mesh position={position} quaternion={quaternion}>
        <planeGeometry args={[0.1, 0.8]} />
        <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />
      </mesh>
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
