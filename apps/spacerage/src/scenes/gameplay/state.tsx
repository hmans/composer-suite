import { RigidBodyApi } from "@react-three/rapier"
import { Bucket } from "miniplex"
import { World } from "miniplex"
import { createReactAPI } from "miniplex/react"
import { makeStore } from "statery"
import { AudioListener, Object3D, Vector3 } from "three"
import { createQueue } from "@hmans/queue"

export enum Layers {
  Player,
  Bullet,
  Asteroid,
  Pickup
}

export const gameplayStore = makeStore({
  listener: null as AudioListener | null
})

export type Entity = {
  asteroid?: {
    spawnPosition: Vector3
    scale: number
  }

  player?: true
  bullet?: JSX.Element
  debris?: JSX.Element
  sparks?: JSX.Element
  smoke?: JSX.Element
  pickup?: JSX.Element
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

export const world = new World<Entity>()
export const ECS = { ...createReactAPI(world), world }
export const queue = createQueue()

// export const worldBucket = new Bucket<{
//   isSparks?: true
//   isDebris?: true
//   isAsteroidExplosion?: true
//   isSmokeVFX?: true
//   isPickup?: true

//   age?: number
//   destroyAfter?: number
//   jsx?: JSX.Element
//   rigidBody?: RigidBodyApi
//   sceneObject?: Object3D
// }>()
