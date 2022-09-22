import { makeStore } from "statery"
import { Object3D } from "three"
import { createECS } from "miniplex-react"
import { RigidBodyEntity } from "@hmans/physics3d"

export const gameplayStore = makeStore({
  player: null as Object3D | null
})

export type Entity = {
  isAsteroid?: boolean
  sceneObject?: Object3D
  rigidBody?: RigidBodyEntity
}

export const ECS = createECS<Entity>()
