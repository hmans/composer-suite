import { archetype, createBucket } from "entity-composer"
import { createComponents } from "entity-composer/react"
import { Object3D } from "three"

export type Entity = {
  jsx?: JSX.Element
  health?: number
  transform?: Object3D
}

export const world = createBucket<Entity>()
export const withTransform = world.derive(archetype("transform"))

export const ECS = createComponents(world)
