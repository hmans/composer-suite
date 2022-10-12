import { useConst } from "@hmans/use-const"
import { InstancedMeshProps, useFrame } from "@react-three/fiber"
import { World } from "miniplex"
import React, {
  forwardRef,
  Ref,
  useImperativeHandle,
  useLayoutEffect
} from "react"
import { Material, Matrix4, Object3D } from "three"
import { InstancedParticles as InstancedParticlesImpl } from "vfx-composer"
import { DefaultContext, ParticlesContext } from "./context"

const tmpMatrix = new Matrix4()

const invertedParticlesMatrix = new Matrix4()

export type Entity = {
  id: number
  sceneObject: Object3D
}

export type InstancedParticlesProps = Omit<
  InstancedMeshProps,
  "material" | "args" | "ref"
> & {
  ref?: Ref<InstancedParticlesImpl>
  args?: ConstructorParameters<typeof InstancedParticlesImpl>
  material?: Material
  capacity?: number
  safetyCapacity?: number
  updatePriority?: number
  context?: ParticlesContext
}

export const InstancedParticles = forwardRef<
  InstancedParticlesImpl,
  InstancedParticlesProps
>(
  (
    {
      children,
      capacity,
      safetyCapacity,
      geometry,
      material,
      updatePriority,
      context = DefaultContext,
      ...props
    },
    ref
  ) => {
    /* The Particles instance this component is managing. */
    const particles = useConst(
      () =>
        new InstancedParticlesImpl(geometry, material, capacity, safetyCapacity)
    )

    /* A small ECS world for controlled particles. */
    const ecs = useConst(() => new World<Entity>())

    useFrame(function controlledParticlesUpdate() {
      if (ecs.entities.length === 0) return

      /* Make sure the effect's world matrix is up to date. (If we don't do it now,
      we'd be using a stale matrix.) */
      particles.updateMatrixWorld()
      invertedParticlesMatrix.copy(particles.matrixWorld).invert()

      /* Iterate through entities */
      for (const entity of ecs.entities) {
        if (!entity) continue
        const { id, sceneObject } = entity

        /* Update the particle's matrix */
        particles.setMatrixAt(
          id,
          tmpMatrix
            .copy(sceneObject.matrixWorld)
            .premultiply(invertedParticlesMatrix)
        )
      }

      /* Queue a re-upload */
      particles.instanceMatrix.needsUpdate = true
    }, updatePriority)

    /* Dispose of the particles instance on unmount */
    useLayoutEffect(() => {
      return () => particles.dispose()
    }, [particles])

    useImperativeHandle(ref, () => particles)

    return (
      <primitive object={particles} {...props}>
        <context.Provider value={{ particles, ecs }}>
          {children}
        </context.Provider>
      </primitive>
    )
  }
)
