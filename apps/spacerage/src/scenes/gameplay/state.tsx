import { RigidBodyEntity } from "@hmans/physics3d"
import { Object3DProps } from "@react-three/fiber"
import { Tag } from "miniplex"
import { createECS } from "miniplex-react"
import { between, upTo } from "randomish"
import { useContext } from "react"
import { makeStore } from "statery"
import { Color, Object3D, Quaternion, Vector3 } from "three"
import { Emitter } from "vfx-composer-r3f"
import { DebrisContext } from "./Debris"
import { SparksEmitter } from "./Sparks"

const tmpVec3 = new Vector3()

export enum Layers {
  Player,
  Asteroid
}

export const gameplayStore = makeStore({
  player: null as Object3D | null
})

export type Entity = {
  asteroid?: {
    spawnPosition: Vector3
    scale: number
  }

  isBullet?: Tag
  isDebris?: Tag
  isSparks?: Tag
  isNebula?: Tag

  velocity?: Vector3
  health?: number

  jsx?: JSX.Element

  sceneObject?: Object3D
  rigidBody?: RigidBodyEntity

  age?: number
  destroyAfter?: number
}

export const ECS = createECS<Entity>()

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

const DebrisEmitter = (props: Object3DProps) => {
  const { particles } = useContext(DebrisContext)

  return (
    <Emitter
      {...props}
      rate={Infinity}
      limit={between(2, 5)}
      setup={({ position, scale }) => {
        scale.setScalar(between(0.5, 2))
        particles.setLifetime(between(0.5, 1.5), upTo(0.1))
        position.add(tmpVec3.randomDirection())
      }}
    />
  )
}
