import * as RAPIER from "@dimforge/rapier3d-compat"
import { useConst } from "@hmans/use-const"
import { GroupProps } from "@react-three/fiber"
import { RegisteredEntity } from "miniplex"
import React, {
  forwardRef,
  PropsWithoutRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Group } from "three"
import { PhysicsEntity, usePhysicsWorld } from "./World"

export type RigidBodyEntity = RegisteredEntity<PhysicsEntity>

export type RigidBodyProps = PropsWithoutRef<GroupProps> & {
  linearDamping?: number
  angularDamping?: number
  enabledRotations?: [boolean, boolean, boolean]
  enabledTranslations?: [boolean, boolean, boolean]
}

export const RigidBody = forwardRef<RigidBodyEntity, RigidBodyProps>(
  (
    {
      children,
      angularDamping,
      enabledRotations,
      enabledTranslations,
      linearDamping,
      ...groupProps
    },
    ref
  ) => {
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

    useLayoutEffect(() => {
      /* Synchronize rigidbody translation and rotation with sceneObject */
      const { position, quaternion } = sceneObject.current
      body.setTranslation(position, true)
      body.setRotation(quaternion, true)

      /* TODO: set these relative to the physics world object! */

      /* On unmount, remove the body from the world again. */
      return () => {
        world.removeRigidBody(body)
      }
    }, [body])

    /* Register ECS entity */
    const entity = useRef<RigidBodyEntity>()
    useLayoutEffect(() => {
      entity.current = ecs.createEntity({
        body,
        sceneObject: sceneObject.current
      })

      return () => ecs.destroyEntity(entity.current!)
    }, [body])

    /* Update props */
    useLayoutEffect(() => {
      if (angularDamping !== undefined) body.setAngularDamping(angularDamping)
    }, [body, angularDamping])

    useLayoutEffect(() => {
      if (enabledTranslations !== undefined)
        body.setEnabledTranslations(...enabledTranslations, true)
    }, [body, enabledTranslations])

    useLayoutEffect(() => {
      if (enabledRotations !== undefined)
        body.setEnabledRotations(...enabledRotations, true)
    }, [body, enabledRotations])

    useLayoutEffect(() => {
      if (linearDamping !== undefined) body.setLinearDamping(linearDamping)
    }, [body, linearDamping])

    /* Forward entity as ref */
    useImperativeHandle(ref, () => entity.current!)

    return (
      <group ref={sceneObject} {...groupProps}>
        {children}
      </group>
    )
  }
)
