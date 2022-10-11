import { archetype, createBucket, createDerivedBucket } from "bucketeer"
import { createBucketComponents } from "bucketeer/react"
import { Object3D } from "three"

export type Entity = {
  jsx?: JSX.Element
  health: number
  transform?: Object3D
}

export const world = createBucket<Entity>()
export const withTransform = createDerivedBucket(world, archetype("transform"))
export const withJSX = createDerivedBucket(world, archetype("jsx"))
export const ECS = createBucketComponents(world)
