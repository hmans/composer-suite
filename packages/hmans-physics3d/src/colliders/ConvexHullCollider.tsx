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
    /* Create the descriptor */
    const desc = RAPIER.ColliderDesc.convexHull(points)
    if (!desc) throw new Error("Could not create convex hull collider")

    /* Create the collider */
    const collider = world.createCollider(desc, body)

    /* Destroy the collider on unmount */
    return () => world.removeCollider(collider, true)
  })

  return <group {...props} ref={ref} />
}

export default forwardRef(ConvexHullCollider)
