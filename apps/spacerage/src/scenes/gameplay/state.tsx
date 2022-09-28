import { RigidBodyEntity } from "@hmans/physics3d"
import { Tag } from "miniplex"
import { makeStore } from "statery"
import { Object3D, Vector3, AudioListener } from "three"
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
  isDebris?: Tag
  isSparks?: Tag
  isNebula?: Tag
  asteroidExplosion?: JSX.Element

  sound?: JSX.Element

  velocity?: Vector3
  health?: number

  jsx?: JSX.Element

  sceneObject?: Object3D
  rigidBody?: RigidBodyEntity

  age?: number
  destroyAfter?: number
}

export const ECS = createECS<Entity>()
