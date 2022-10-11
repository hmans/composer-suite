import { archetype, createBucket } from "bucketeer"
import { createComponents } from "bucketeer/react"
import { Object3D } from "three"

export type Entity = {
  jsx?: JSX.Element
  health?: number
  transform?: Object3D
}

export const world = createBucket<Entity>()
export const withTransform = world.derive(archetype("transform"))
export const withJSX = world.derive(archetype("jsx"))
export const ECS = createComponents(world)
