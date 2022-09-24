import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { useRigidBody } from "../RigidBody"
import { usePhysicsWorld } from "../World"
import * as RAPIER from "@dimforge/rapier3d-compat"
import {
  Float32BufferAttribute,
  Group,
  Matrix4,
  Quaternion,
  Vector3
} from "three"
import { GroupProps } from "@react-three/fiber"

export const multiplyByMatrix = (points: Float32Array, matrix: Matrix4) => {
  const buffer = new Float32BufferAttribute(points, 3)
  buffer.applyMatrix4(matrix)
  return buffer.array
}

export type ConvexHullColliderProps = {
  points: Float32Array
} & GroupProps

function ConvexHullCollider(
  { points, ...props }: ConvexHullColliderProps,
  ref: ForwardedRef<Group>
) {
  const { world } = usePhysicsWorld()
  const rb = useRigidBody()
  const sceneObject = useRef<Group>(null!)

  /* add and remove collider */
  useEffect(() => {
    if (!rb.sceneObject) return
    if (!sceneObject.current) return

    /* Scale the input */
    const position = new Vector3()
    const rotation = new Quaternion()
    const scale = new Vector3()

    sceneObject.current.updateMatrixWorld()
    sceneObject.current.matrixWorld.decompose(position, rotation, scale)

    console.log(scale)

    const relativeMatrix = new Matrix4().compose(
      new Vector3(),
      rotation.multiply(rb.sceneObject.quaternion.clone().invert()),
      scale
    )

    /* Scale points */
    const scaledPoints = multiplyByMatrix(
      points,
      relativeMatrix
    ) as Float32Array

    /* Create the descriptor */
    const desc = RAPIER.ColliderDesc.convexHull(scaledPoints)
    if (!desc) throw new Error("Could not create convex hull collider")

    /* Create the collider */
    const collider = world.createCollider(desc, rb.body)

    /* Destroy the collider on unmount */
    return () => world.removeCollider(collider, true)
  })

  useImperativeHandle(ref, () => sceneObject.current)

  return <group {...props} ref={sceneObject} />
}

export default forwardRef(ConvexHullCollider)
