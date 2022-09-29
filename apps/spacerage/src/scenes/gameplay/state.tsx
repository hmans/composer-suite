import { RigidBodyApi } from "@react-three/rapier"
import { Tag } from "miniplex"
import { makeStore } from "statery"
import { AudioListener, Object3D, Vector3 } from "three"
import { createECS } from "../../vendor/miniplex-react/createECS"

export enum Layers {
  Player,
  Asteroid
}

export const gameplayStore = makeStore({
  player: null as Object3D | null,
  listener: null as AudioListener | null
})

export type Entity = {
  asteroid?: {
    spawnPosition: Vector3
    scale: number
  }

  isBullet?: Tag
  debris?: JSX.Element
  sparks?: JSX.Element
  isNebula?: Tag
  asteroidExplosion?: JSX.Element

  sound?: JSX.Element

  velocity?: Vector3
  health?: number

  jsx?: JSX.Element

  sceneObject?: Object3D
  rigidBody?: RigidBodyApi

  age?: number
  destroyAfter?: number
}

export const ECS = createECS<Entity>()
