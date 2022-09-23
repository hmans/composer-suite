import React, { ForwardedRef, forwardRef, useLayoutEffect } from "react"
import { useRigidBody } from "../RigidBody"
import { usePhysicsWorld } from "../World"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { Group } from "three"
import { GroupProps } from "@react-three/fiber"

export type ConvexHullColliderProps = {
  points: Float32Array
} & GroupProps

function ConvexHullCollider(
  { points, ...props }: ConvexHullColliderProps,
  ref: ForwardedRef<Group>
) {
  const { world } = usePhysicsWorld()
  const { body } = useRigidBody()

  /* add and remove collider */
  useLayoutEffect(() => {
    const desc = RAPIER.ColliderDesc.convexHull(points)
    if (!desc) throw new Error("Could not create convex hull collider")
    const collider = world.createCollider(desc, body)
    return () => world.removeCollider(collider, true)
  })

  return <group {...props} ref={ref} />
}

export default forwardRef(ConvexHullCollider)
