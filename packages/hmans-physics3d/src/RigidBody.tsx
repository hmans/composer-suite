import * as RAPIER from "@dimforge/rapier3d-compat"
import { useConst } from "@hmans/use-const"
import { RegisteredEntity } from "miniplex"
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import { Group } from "three"
import { PhysicsEntity, usePhysicsWorld } from "./World"

export type RigidBodyEntity = RegisteredEntity<PhysicsEntity>

export type RigidBodyProps = {
  children?: ReactNode
}

export const RigidBody = forwardRef<RigidBodyEntity, RigidBodyProps>(
  ({ children }, ref) => {
    const sceneObject = useRef<Group>(null!)
    const { world, ecs } = usePhysicsWorld()

    /* Create RigidBody */
    const body = useConst(() => {
      const desc = RAPIER.RigidBodyDesc.dynamic()
      const body = world.createRigidBody(desc)

      /* Fake collider */
      const colliderDesc = RAPIER.ColliderDesc.cuboid(1, 1, 1)
      world.createCollider(colliderDesc, body)

      return body
    })

    /* Register ECS entity */
    const entity = useRef<RigidBodyEntity>()
    useLayoutEffect(() => {
      entity.current = ecs.createEntity({
        body,
        sceneObject: sceneObject.current
      })

      return () => ecs.destroyEntity(entity.current!)
    }, [body])

    /* Forward entity as ref */
    useImperativeHandle(ref, () => entity.current!)

    return <group ref={sceneObject}>{children}</group>
  }
)
