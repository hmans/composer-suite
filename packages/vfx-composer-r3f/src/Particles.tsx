import { useConst } from "@hmans/use-const"
import { InstancedMeshProps } from "@react-three/fiber"
import { getShaderRootForMaterial } from "material-composer-r3f"
import React, {
  createContext,
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useLayoutEffect
} from "react"
import { Material } from "three"
import { Particles as ParticlesImpl } from "vfx-composer"
import { useFrameEffect } from "./lib/useFrameEffect"

export type ParticlesProps = Omit<
  InstancedMeshProps,
  "material" | "args" | "ref"
> & {
  ref?: Ref<ParticlesImpl>
  args?: ConstructorParameters<typeof ParticlesImpl>
  material?: Material
  capacity?: number
  safetyCapacity?: number
}

const Context = createContext<ParticlesImpl>(null!)

export const useParticlesContext = () => useContext(Context)

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  (
    { children, capacity, safetyCapacity, geometry, material, ...props },
    ref
  ) => {
    const particles = useConst(
      () => new ParticlesImpl(geometry, material, capacity, safetyCapacity)
    )

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

    /* Dispose of the particles instance on unmount */
    useLayoutEffect(() => {
      return () => particles.dispose()
    }, [particles])

    useImperativeHandle(ref, () => particles)

    return (
      <primitive object={particles} {...props}>
        <Context.Provider value={particles}>{children}</Context.Provider>
      </primitive>
    )
  }
)
