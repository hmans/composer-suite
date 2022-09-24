import * as RAPIER from "@dimforge/rapier3d-compat"
import { GroupProps } from "@react-three/fiber"
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import * as THREE from "three"
import { useRigidBody } from "../RigidBody"
import { usePhysicsWorld } from "../World"

export const multiplyByMatrix = (
  points: Float32Array,
  matrix: THREE.Matrix4
) => {
  const buffer = new THREE.Float32BufferAttribute(points, 3)
  buffer.applyMatrix4(matrix)
  return buffer.array
}

export type ConvexHullColliderProps = {
  points: Float32Array
} & GroupProps

function ConvexHullCollider(
  { points, ...props }: ConvexHullColliderProps,
  ref: ForwardedRef<THREE.Group>
) {
  const { world } = usePhysicsWorld()
  const rb = useRigidBody()
  const sceneObject = useRef<THREE.Group>(null!)

  /* add and remove collider */
  useEffect(() => {
    /* Grab the collider's world transform */
    const position = new THREE.Vector3()
    const rotation = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    sceneObject.current.matrixWorld.decompose(position, rotation, scale)

    /* Create the transform matrix relative to the ownnign rigidbody */
    const relativeMatrix = new THREE.Matrix4().compose(
      new THREE.Vector3(),
      rotation.multiply(rb.sceneObject.quaternion.clone().invert()),
      scale
    )

    /* Scale points using the matrix */
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
  }, [])

  useImperativeHandle(ref, () => sceneObject.current)

  return <group {...props} ref={sceneObject} />
}

export default forwardRef(ConvexHullCollider)
