import { RigidBodyEntity } from "@hmans/physics3d"
import { createECS } from "miniplex-react"
import { makeStore } from "statery"
import { Object3D, Quaternion, Vector3 } from "three"

export const gameplayStore = makeStore({
  player: null as Object3D | null
})

export type Entity = {
  isAsteroid?: boolean
  isBullet?: boolean

  jsx?: JSX.Element

  sceneObject?: Object3D
  rigidBody?: RigidBodyEntity
}

export const ECS = createECS<Entity>()

export const spawnBullet = (position: Vector3, quaternion: Quaternion) => {
  ECS.world.createEntity({
    isBullet: true,

    jsx: (
      <mesh position={position} quaternion={quaternion}>
        <planeGeometry args={[0.2, 0.5]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
    )
  })
}
