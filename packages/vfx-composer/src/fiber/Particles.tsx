import { extend, InstancedMeshProps, Node } from "@react-three/fiber"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { Particles as ParticlesImpl } from "../Particles"
import { VFXMaterial as VFXMaterialImpl } from "../VFXMaterial"

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

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  (
    { maxParticles = 1000, safetyBuffer = 100, geometry, material, ...props },
    ref
  ) => {
    const particles = useRef<ParticlesImpl>(null!)

    useEffect(() => {
      particles.current.setupParticles()
    }, [])

    useImperativeHandle(ref, () => particles.current)

    return (
      <vfxComposerParticles
        args={[geometry, material, maxParticles, safetyBuffer]}
        ref={particles}
        {...props}
      />
    )
  }
)
