import { useConst } from "@hmans/use-const"
import { Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Matrix4, Object3D } from "three"
import { useParticlesContext } from "./Particles"

const hideMatrix = new Matrix4().makeScale(0, 0, 0)

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
      particles.setMatrixAt(id, hideMatrix)
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
