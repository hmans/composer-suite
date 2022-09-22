import { GroupProps } from "@react-three/fiber"
import React, { forwardRef, PropsWithoutRef, useLayoutEffect } from "react"
import { useRigidBody } from "./RigidBody"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { usePhysicsWorld } from "./World"

export type ColliderProps = PropsWithoutRef<GroupProps>

export const Collider = forwardRef<any, ColliderProps>((props, ref) => {
  const { world } = usePhysicsWorld()
  const { body } = useRigidBody()

  /* add and remove collider */
  useLayoutEffect(() => {
    const desc = RAPIER.ColliderDesc.cuboid(1, 1, 1)
    const collider = world.createCollider(desc, body)

    return () => {
      world.removeCollider(collider, true)
    }
  })

  return <group {...props} />
})
