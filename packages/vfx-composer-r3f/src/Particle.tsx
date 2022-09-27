import { Object3DProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Matrix4, Object3D } from "three"
import { useParticlesContext } from "./InstancedParticles"

const hideMatrix = new Matrix4().makeScale(0, 0, 0)

/**
 * Use `<Particle>` to emit a single particle that remains CPU-controlled, meaning
 * that it will continuously update its instance matrix to match its transform
 * in the Three.js scene graph.
 *
 * **Note:** As soon as you use just a single `<Particle>` in your `<InstancedParticles>` effect,
 * it will disable the partial buffer updates, and result in a full buffer update every frame.
 */
export const Particle = forwardRef<Object3D, Object3DProps>((props, ref) => {
  const sceneObject = useRef<Object3D>(null!)
  const { particles, ecs } = useParticlesContext()
  const id = useRef<number>()

  useLayoutEffect(() => {
    /* Store the particle's ID */
    const cursor = particles.cursor
    id.current = cursor

    /* Emit the particle */
    particles.emit(1)

    /* Register with ECS */
    const entity = ecs.createEntity({
      id: cursor,
      sceneObject: sceneObject.current
    })

    /* Hide the particle again on unmount */
    return () => {
      ecs.destroyEntity(entity)
      particles.setMatrixAt(cursor, hideMatrix)
      particles.instanceMatrix.needsUpdate = true
    }
  }, [particles])

  /* Forward the ref */
  useImperativeHandle(ref, () => sceneObject.current)

  return <object3D ref={sceneObject} matrixAutoUpdate={false} {...props} />
})
