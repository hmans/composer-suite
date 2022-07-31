import { extend, InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { Particles as ParticlesImpl } from "../Particles"

extend({ VfxComposerParticles_: ParticlesImpl })

export type ParticlesProps = InstancedMeshProps & { maxParticles?: number }

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  ({ maxParticles = 1000, geometry, material, ...props }, ref) => {
    const particles = useRef<ParticlesImpl>(null!)

    useEffect(() => {
      particles.current.setupParticles()
    }, [])

    useImperativeHandle(ref, () => particles.current)

    return (
      // @ts-ignore
      <vfxComposerParticles_
        args={[geometry, material, maxParticles]}
        {...props}
        ref={particles}
      />
    )
  }
)
