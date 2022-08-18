import { extend, InstancedMeshProps } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react"
import { Particles as ParticlesImpl } from "vfx-composer"
import { VFXMaterial as VFXMaterialImpl } from "vfx-composer"

export type ParticlesProps = Omit<InstancedMeshProps, "material" | "args"> & {
  args?: ConstructorParameters<typeof ParticlesImpl>
  material?: VFXMaterialImpl
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
    const [_, setReady] = useState(false)
    const particles = useRef<ParticlesImpl>(null!)

    /*
    We need to initialize the particles mesh in an effect, because in most cases,
    the material driving it will only be created in its children.
    */
    useEffect(() => {
      particles.current.setupParticles()
      setReady(true)
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
