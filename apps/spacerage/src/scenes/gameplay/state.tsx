import { RigidBodyEntity } from "@hmans/physics3d"
import { createECS } from "miniplex-react"
import { makeStore } from "statery"
import { Object3D, Quaternion, Vector3 } from "three"

const tmpVec3 = new Vector3()
const tmpQuat = new Quaternion()

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

export const fireWeapon = (origin: Object3D) => {
  ECS.world.createEntity({
    isBullet: true,

    jsx: (
      <mesh
        position={origin.getWorldPosition(tmpVec3)}
        quaternion={origin.getWorldQuaternion(tmpQuat)}
      >
        <planeGeometry args={[0.2, 0.5]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
    )
  })
}
