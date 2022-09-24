import { useConst } from "@hmans/use-const"
import { InstancedMeshProps, useFrame } from "@react-three/fiber"
import { getShaderRootForMaterial } from "material-composer-r3f"
import { World } from "miniplex"
import React, {
  createContext,
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useLayoutEffect
} from "react"
import { Material, Matrix4, Object3D } from "three"
import { Particles as ParticlesImpl } from "vfx-composer"
import { useFrameEffect } from "./lib/useFrameEffect"

const tmpMatrix = new Matrix4()

export type ParticlesProps = Omit<
  InstancedMeshProps,
  "material" | "args" | "ref"
> & {
  ref?: Ref<ParticlesImpl>
  args?: ConstructorParameters<typeof ParticlesImpl>
  material?: Material
  capacity?: number
  safetyCapacity?: number
  updatePriority?: number
}

export type Entity = {
  id: number
  sceneObject: Object3D
}

const Context = createContext<{ particles: ParticlesImpl; ecs: World<Entity> }>(
  null!
)

export const useParticlesContext = () => useContext(Context)

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  (
    {
      children,
      capacity,
      safetyCapacity,
      geometry,
      material,
      updatePriority,
      ...props
    },
    ref
  ) => {
    /* The Particles instance this component is managing. */
    const particles = useConst(
      () => new ParticlesImpl(geometry, material, capacity, safetyCapacity)
    )

    /* A small ECS world for controlled particles. */
    const ecs = useConst(() => new World<Entity>())

    /*
    We need to be able to react to the particle mesh's material changing. Currently,
    the best way of doing this is to use a custom per-frame callback that will monitor
    the material for changes, and re-initialize the particles mesh when it does.
    We will find a cleaner way of doing this some time in the future.
    */

    useFrameEffect(
      () => particles.material as Material,
      (material) => {
        if (!material) return
        const root = getShaderRootForMaterial(material)
        if (root) particles.setupParticles(root)
      },
      -100
    )

    useFrame(() => {
      if (!ecs.entities.length) return

      /* Make sure the effect's world matrix is up to date */
      particles.updateMatrixWorld()

      /* Iterate through entities */
      for (const entity of ecs.entities) {
        if (!entity) continue
        const { id, sceneObject } = entity

        /* Update the particle's matrix */
        particles.setMatrixAt(
          id,
          tmpMatrix
            .copy(sceneObject.matrixWorld)
            .premultiply(particles.matrixWorld.invert())
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
        <Context.Provider value={{ particles, ecs }}>
          {children}
        </Context.Provider>
      </primitive>
    )
  }
)
