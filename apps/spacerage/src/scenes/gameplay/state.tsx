import { RigidBodyEntity } from "@hmans/physics3d"
import { createECS } from "miniplex-react"
import { makeStore } from "statery"
import { Object3D, Vector3 } from "three"

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

export const fireWeapon = (position: Vector3) => {
  ECS.world.createEntity({
    isBullet: true,

    jsx: (
      <mesh position={position}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    )
  })
}
