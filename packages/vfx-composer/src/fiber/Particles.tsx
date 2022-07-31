import { extend, InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Particles as ParticlesImpl } from "../Particles"

extend({ VfxComposerParticles_: ParticlesImpl })

export type ParticlesProps = InstancedMeshProps

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  (props, ref) => {
    const particles = useRef<ParticlesImpl>(null!)

    useLayoutEffect(() => {
      particles.current.setupParticles()
    }, [])

    useImperativeHandle(ref, () => particles.current)

    // @ts-ignore
    return <vfxComposerParticles_ {...props} ref={particles} />
  }
)
