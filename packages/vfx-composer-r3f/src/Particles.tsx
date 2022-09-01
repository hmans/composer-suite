import { useRerender } from "@hmans/use-rerender"
import { extend, InstancedMeshProps, useFrame } from "@react-three/fiber"
import { getShaderRootForMaterial } from "material-composer-r3f"
import React, {
  createContext,
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Material } from "three"
import { Particles as ParticlesImpl } from "vfx-composer"

export type ParticlesProps = Omit<
  InstancedMeshProps,
  "material" | "args" | "ref"
> & {
  ref?: Ref<ParticlesImpl>
  args?: ConstructorParameters<typeof ParticlesImpl>
  material?: Material
  maxParticles?: number
  safetyBuffer?: number
}

extend({ VfxComposerParticles: ParticlesImpl })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      vfxComposerParticles: ParticlesProps
    }
  }
}

const Context = createContext<ParticlesImpl | null>(null)

export const useParticlesContext = () => useContext(Context)

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  (
    {
      children,
      maxParticles = 1000,
      safetyBuffer = 100,
      geometry,
      material,
      ...props
    },
    ref
  ) => {
    const rerender = useRerender()
    const particles = useRef<ParticlesImpl>(null!)

    /*
    We need to be able to react to the particle mesh's material changing. Currently,
    the best way of doing this is to use a custom per-frame callback that will monitor
    the material for changes, and re-initialize the particles mesh when it does.
    We will find a cleaner way of doing this some time in the future.
    */
    const currentMaterial = useRef<Material>(null!)
    useFrame(() => {
      if (!particles.current) return
      if (!particles.current.material) return

      const material = particles.current.material as Material
      if (material !== currentMaterial.current) {
        const root = getShaderRootForMaterial(material)
        if (root) particles.current.setupParticles(root)
        currentMaterial.current = material
      }
    })

    /*
    We need to re-render this beautiful component once, because it's highly
    likely that the material driving the particle effect is only declared
    within its children.
    */
    useLayoutEffect(() => {
      rerender()
    }, [particles])

    useImperativeHandle(ref, () => particles.current)

    return (
      <vfxComposerParticles
        args={[geometry, material, maxParticles, safetyBuffer]}
        ref={particles}
        {...props}
      >
        <Context.Provider value={particles.current}>
          {children}
        </Context.Provider>
      </vfxComposerParticles>
    )
  }
)
