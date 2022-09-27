import { RigidBodyEntity } from "@hmans/physics3d"
import { Tag } from "miniplex"
import { makeStore } from "statery"
import { Object3D, Vector3 } from "three"
import { createECS } from "../../vendor/miniplex-react/createECS"
import { createWorld } from "entity-composer/vanilla"
import { createWorldComponents } from "entity-composer"

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

/* Entity Composer */

export type VelocityComponent = {
  velocity: Vector3
}

export type HealthComponent = {
  health: {
    max: number
    current: number
  }
}

export type TransformComponent = {
  transform: Object3D
}

export type JSXComponent = {
  jsx: JSX.Element
}

export type AsteroidEntity = {
  asteroid: true
} & HealthComponent

export type BulletEntity = {
  bullet: true
} & VelocityComponent &
  JSXComponent &
  Partial<TransformComponent>

export type GameEntity = AsteroidEntity | BulletEntity

export function isBullet(entity: GameEntity): entity is BulletEntity {
  return "bullet" in entity
}

export function isAsteroid(entity: GameEntity): entity is AsteroidEntity {
  return "asteroid" in entity
}

export const world = createWorld<AsteroidEntity | BulletEntity>()

export const ECS2 = createWorldComponents(world)

export const bullets = world.index(isBullet)
