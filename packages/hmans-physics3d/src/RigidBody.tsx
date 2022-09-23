import * as RAPIER from "@dimforge/rapier3d-compat"
import { useConst } from "@hmans/use-const"
import { GroupProps } from "@react-three/fiber"
import { RegisteredEntity } from "miniplex"
import React, {
  createContext,
  forwardRef,
  PropsWithoutRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import { Group, Object3D } from "three"
import { PhysicsEntity, usePhysicsWorld } from "./World"

export type RigidBodyEntity = PhysicsEntity

const RigidBodyContext = createContext<{ body: RAPIER.RigidBody }>(null!)

export const useRigidBody = () => useContext(RigidBodyContext)

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
    const { world, ecs } = usePhysicsWorld()
    const sceneObject = useRef<Group>(null!)

    const state = useConst<RigidBodyEntity>(() => ({
      body: world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()),
      sceneObject: null!
    }))

    useLayoutEffect(() => {
      /* Synchronize rigidbody translation and rotation with sceneObject */
      const { position, quaternion } = sceneObject.current
      state.body.setTranslation(position, true)
      state.body.setRotation(quaternion, true)

      /* TODO: set these relative to the physics world object! */

      /* Create an entity */
      const entity = ecs.createEntity(state)

      entity.sceneObject = sceneObject.current

      /* On unmount, remove the body from the world again. */
      return () => {
        ecs.destroyEntity(entity)
        world.removeRigidBody(state.body)
      }
    }, [])

    /* Update props */
    useLayoutEffect(() => {
      if (!state?.body) return

      if (angularDamping !== undefined)
        state.body.setAngularDamping(angularDamping)
      if (enabledTranslations !== undefined)
        state.body.setEnabledTranslations(...enabledTranslations, true)
      if (enabledRotations !== undefined)
        state.body.setEnabledRotations(...enabledRotations, true)
      if (linearDamping !== undefined)
        state.body.setLinearDamping(linearDamping)
    })

    /* Forward entity as ref */
    useImperativeHandle(ref, () => state)

    return (
      <group ref={sceneObject} {...groupProps}>
        {state && (
          <RigidBodyContext.Provider value={state}>
            {children}
          </RigidBodyContext.Provider>
        )}
      </group>
    )
  }
)
