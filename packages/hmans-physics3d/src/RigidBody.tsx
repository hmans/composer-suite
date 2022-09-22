import * as RAPIER from "@dimforge/rapier3d-compat"
import { useConst } from "@hmans/use-const"
import React, { ReactNode } from "react"
import { usePhysicsWorld } from "./World"

export type RigidBodyProps = {
  children?: ReactNode
}

export const RigidBody = ({ children }: RigidBodyProps) => {
  const { world } = usePhysicsWorld()

  const body = useConst(() => {
    const desc = RAPIER.RigidBodyDesc.dynamic()
    const body = world.createRigidBody(desc)

    /* Fake collider */
    const colliderDesc = RAPIER.ColliderDesc.cuboid(1, 1, 1)
    world.createCollider(colliderDesc, body)

    return body
  })

  return <>{children}</>
}
