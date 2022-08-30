import { useRerender } from "@hmans/use-rerender"
import { extend, InstancedMeshProps } from "@react-three/fiber"
import { ComposableMaterial } from "material-composer"
import { getShaderRootForMaterial } from "material-composer-r3f"
import React, {
  createContext,
  forwardRef,
  PropsWithRef,
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
  material?: ComposableMaterial
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
    Every time this component re-renders, see if it needs to set up its
    particle engine. This only happens when the material has changed.
     */
    useLayoutEffect(() => {
      const material = particles.current.material as Material
      particles.current.setupParticles(getShaderRootForMaterial(material)!)
    }, [particles, particles.current?.material])

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
