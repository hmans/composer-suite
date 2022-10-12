import { RigidBodyApi } from "@react-three/rapier"
import { Bucket } from "bucketeer"
import { createBucketComponents } from "bucketeer/react"
import { Tag } from "miniplex"
import { createECS } from "miniplex-react"
import { makeStore } from "statery"
import { AudioListener, Object3D, Vector3 } from "three"

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

  player?: Tag
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

export const ECS = createECS<Entity>()

export const worldBucket = new Bucket<{
  isSparks?: true
  isDebris?: true
  isAsteroidExplosion?: true

  age?: number
  destroyAfter?: number
  jsx?: JSX.Element
}>()

export const BECS = createBucketComponents(worldBucket)
