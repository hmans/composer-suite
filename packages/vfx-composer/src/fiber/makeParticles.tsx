import { InstancedMeshProps, Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { InstancedMesh, Matrix4, Object3D, Quaternion, Vector3 } from "three"
import { ModulePipe } from "../modules"

/* A couple of temporary variables to avoid allocations */
const tmpPosition = new Vector3()
const tmpRotation = new Quaternion()
const tmpScale = new Vector3(1, 1, 1)
const tmpMatrix = new Matrix4()

export type EmitterProps = Object3DProps & {
  count?: number
  continuous?: boolean
}

export const makeParticles = (
  maxParticles = 1000,
  modules: ModulePipe = []
) => {
  const imeshRef = createRef<InstancedMesh>()
  let cursor = 0

  const spawn = (count: number = 1) => {
    const imesh = imeshRef.current!

    for (let i = 0; i < count; i++) {
      /* Reset instance configuration values */
      tmpPosition.set(0, 0, 0)
      tmpRotation.set(0, 0, 0, 1)
      tmpScale.set(1, 1, 1)

      tmpPosition.randomDirection().multiplyScalar(Math.random() * 10)

      tmpMatrix.compose(tmpPosition, tmpRotation, tmpScale)

      /* Store and upload matrix */
      imesh.setMatrixAt(cursor, tmpMatrix)
      imesh.instanceMatrix.needsUpdate = true

      /* Advance cursor */
      cursor = (cursor + 1) % maxParticles
    }
  }

  /* ROOT COMPONENT */
  const Root = forwardRef<InstancedMesh, InstancedMeshProps>((props, ref) => {
    useImperativeHandle(ref, () => imeshRef.current!)

    return (
      <instancedMesh
        args={[undefined, undefined, maxParticles]}
        ref={imeshRef}
        {...props}
      />
    )
  })

  /* EMITTER COMPONENT */
  const Emitter = forwardRef<Object3D, EmitterProps>(
    ({ continuous, count = 1, ...props }, ref) => {
      const object = useRef<Object3D>(null!)

      useImperativeHandle(ref, () => object.current)

      useEffect(() => {
        if (continuous) return
        spawn(count)
      }, [])

      useFrame(() => {
        if (continuous) {
          spawn(count)
        }
      })

      return <object3D ref={object} {...props} />
    }
  )

  return { Root, Emitter, spawn }
}
