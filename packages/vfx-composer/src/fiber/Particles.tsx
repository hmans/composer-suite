import { extend, InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo
} from "react"
import { Particles as ParticlesImpl } from "../Particles"
import { ParticlesMaterial as ParticlesMaterialImpl } from "../ParticlesMaterial"

extend({ VfxComposerParticles_: ParticlesImpl })

export type ParticlesProps = InstancedMeshProps & {
  material?: ParticlesMaterialImpl
  maxParticles?: number
}

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  ({ maxParticles = 1000, geometry, material, ...props }, ref) => {
    const particles = useMemo(
      () => new ParticlesImpl(geometry, material, maxParticles),
      [maxParticles]
    )

    useEffect(() => {
      particles.setupParticles()
    }, [particles])

    useEffect(() => () => particles.dispose(), [])

    useImperativeHandle(ref, () => particles)

    return <primitive object={particles} {...props} />
  }
)
