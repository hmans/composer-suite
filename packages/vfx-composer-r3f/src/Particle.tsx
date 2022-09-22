import { useConst } from "@hmans/use-const"
import { Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Matrix4, Object3D, Quaternion, Vector3 } from "three"
import { useParticlesContext } from "./Particles"

export const Particle = forwardRef<Object3D, Object3DProps>((props, ref) => {
  const sceneObject = useRef<Object3D>(null!)
  const particles = useParticlesContext()

  const id = useConst(() => {
    const cursor = particles.cursor
    particles.emit(1)
    return cursor
  })

  /* Hide the particle again on unmount */
  useLayoutEffect(() => {
    return () => {
      particles.setMatrixAt(
        id,
        new Matrix4().compose(
          new Vector3(),
          new Quaternion(),
          new Vector3(0, 0, 0)
        )
      )
    }
  }, [])

  useFrame(() => {
    particles.setMatrixAt(id, sceneObject.current.matrixWorld)
    particles.instanceMatrix.needsUpdate = true
  })

  /* Forward the ref */
  useImperativeHandle(ref, () => sceneObject.current)

  return <object3D ref={sceneObject} {...props} />
})
