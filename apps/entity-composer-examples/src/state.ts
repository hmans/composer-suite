import { createBucket } from "entity-composer"
import { createComponents } from "entity-composer/react"
import { Object3D } from "three"

export type Entity = {
  health?: number
  transform?: Object3D
}

export const world = createBucket<Entity>()

export const ECS = createComponents(world)
