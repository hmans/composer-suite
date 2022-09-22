import { Object3DProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Object3D } from "three"
import { useParticlesContext } from "./Particles"

export const Particle = forwardRef<Object3D, Object3DProps>((props, ref) => {
  const sceneObject = useRef<Object3D>(null!)
  const particles = useParticlesContext()

  /* Spawn a particle on mount */
  useLayoutEffect(() => {
    particles.emit(1)
  }, [particles])

  /* Forward the ref */
  useImperativeHandle(ref, () => sceneObject.current)

  return <object3D ref={sceneObject} {...props} />
})
