import * as RAPIER from "@dimforge/rapier3d-compat"
import { useConst } from "@hmans/use-const"
import { useFrame } from "@react-three/fiber"
import { logDOM } from "@testing-library/react"
import * as Miniplex from "miniplex"
import React, { ReactNode, useContext, useRef } from "react"
import * as THREE from "three"
import { useAsset } from "use-asset"
import { importRapier } from "./util/importRapier"

export type WorldProps = {
  children?: ReactNode
  updatePriority?: number
  gravity?: [number, number, number]
}

export type PhysicsEntity = {
  body: RAPIER.RigidBody
  sceneObject: THREE.Object3D
}

const WorldContext = React.createContext<{
  world: RAPIER.World
  ecs: Miniplex.World<PhysicsEntity>
}>(null!)

export const World = ({
  children,
  gravity = [0, -9.81, 0],
  updatePriority
}: WorldProps) => {
  useAsset(importRapier)

  const ecs = useConst(() => new Miniplex.World<PhysicsEntity>())
  const eventQueue = useConst(() => new RAPIER.EventQueue(false))

  const world = useConst(() => new RAPIER.World(new RAPIER.Vector3(...gravity)))

  const acc = useRef(0)

  useFrame((_, dt) => {
    /* Step the world */
    acc.current += dt
    world.timestep = dt
    while (acc.current >= world.timestep) {
      world.step(eventQueue)
      acc.current -= world.timestep
    }

    /* Update entities */
    for (const entity of ecs.entities) {
      if (!entity) continue

      const { body, sceneObject } = entity

      if (body.isSleeping()) continue

      /* Get transform from rigidbody */
      const position = new THREE.Vector3().copy(
        body.translation() as THREE.Vector3
      )

      const quaternion = new THREE.Quaternion().copy(
        body.rotation() as THREE.Quaternion
      )

      /* Apply transform to scene object */
      sceneObject.position.copy(position)
      sceneObject.quaternion.copy(quaternion)
      sceneObject.updateMatrix()
    }

    /* Handle collision events */
    eventQueue.drainCollisionEvents((event) => {
      console.log(event)
    })
  }, updatePriority)

  return (
    <WorldContext.Provider value={{ world, ecs }}>
      {children}
    </WorldContext.Provider>
  )
}

export const usePhysicsWorld = () => useContext(WorldContext)
