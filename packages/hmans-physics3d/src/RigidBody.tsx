import * as RAPIER from "@dimforge/rapier3d-compat"
import { useConst } from "@hmans/use-const"
import React, { ReactNode, useLayoutEffect, useRef } from "react"
import { Group } from "three"
import { usePhysicsWorld } from "./World"

export type RigidBodyProps = {
  children?: ReactNode
}

export const RigidBody = ({ children }: RigidBodyProps) => {
  const sceneObject = useRef<Group>(null!)
  const { world, ecs } = usePhysicsWorld()

  const body = useConst(() => {
    const desc = RAPIER.RigidBodyDesc.dynamic()
    const body = world.createRigidBody(desc)

    /* Fake collider */
    const colliderDesc = RAPIER.ColliderDesc.cuboid(1, 1, 1)
    world.createCollider(colliderDesc, body)

    return body
  })

  useLayoutEffect(() => {
    const entity = ecs.createEntity({ body, sceneObject: sceneObject.current })
    return () => ecs.destroyEntity(entity)
  }, [body])

  return <group ref={sceneObject}>{children}</group>
}
