import { RigidBodyEntity } from "@hmans/physics3d"
import { GroupProps, Object3DProps } from "@react-three/fiber"
import { createECS } from "miniplex-react"
import { between, upTo } from "randomish"
import { useContext } from "react"
import { makeStore } from "statery"
import { Color, Object3D, Quaternion, Vector3 } from "three"
import { Emitter } from "vfx-composer-r3f"
import { Debris, DebrisContext } from "./Debris"

const tmpVec3 = new Vector3()

export enum Layers {
  Player,
  Asteroid
}

export const gameplayStore = makeStore({
  player: null as Object3D | null
})

export type Entity = {
  isAsteroid?: boolean
  isBullet?: boolean
  isDebris?: boolean

  jsx?: JSX.Element

  sceneObject?: Object3D
  rigidBody?: RigidBodyEntity

  age?: number
  destroyAfter?: number
}

export const ECS = createECS<Entity>()

export const spawnBullet = (position: Vector3, quaternion: Quaternion) => {
  ECS.world.createEntity({
    isBullet: true,
    age: 0,
    destroyAfter: 1,

    jsx: (
      <mesh position={position} quaternion={quaternion}>
        <planeGeometry args={[0.1, 0.8]} />
        <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />
      </mesh>
    )
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
      limit={between(5, 12)}
      setup={({ position }) => {
        particles.setLifetime(between(0.5, 1.5), upTo(0.1))
        position.add(tmpVec3.randomDirection())
      }}
    />
  )
}
