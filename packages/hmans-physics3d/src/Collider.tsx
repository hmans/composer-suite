import * as RAPIER from "@dimforge/rapier3d-compat"
import React, { ForwardedRef, forwardRef, useLayoutEffect } from "react"
import { Group } from "three"
import { useRigidBody } from "./RigidBody"
import { usePhysicsWorld } from "./World"

type ColliderDesc = typeof RAPIER.ColliderDesc

type ColliderShape = keyof ColliderDesc

type ArgsProp<F> = {
  args: F extends (...args: infer A) => any ? A : never
}

export type ColliderProps<S extends ColliderShape> = {
  shape: S
} & ArgsProp<ColliderDesc[S]>

const ColliderInner = <S extends keyof ColliderDesc>(
  { shape, args, ...props }: ColliderProps<S>,
  ref: ForwardedRef<Group>
) => {
  const { world } = usePhysicsWorld()
  const { body } = useRigidBody()

  /* add and remove collider */
  useLayoutEffect(() => {
    if (!shape) {
      console.error("No shape specified!")
      return
    }

    const ctor = RAPIER.ColliderDesc[shape] as any
    const desc = ctor(...args)
    const collider = world.createCollider(desc, body)

    return () => {
      world.removeCollider(collider, true)
    }
  })

  return <group {...props} ref={ref} />
}

export const Collider = forwardRef(ColliderInner)
