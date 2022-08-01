import { InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react"
import { Particles as ParticlesImpl } from "../Particles"
import { VFXMaterial as ParticlesMaterialImpl } from "../VFXMaterial"

export type ParticlesProps = InstancedMeshProps & {
  material?: ParticlesMaterialImpl
  maxParticles?: number
  safetyBuffer?: number
}

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  (
    { maxParticles = 1000, safetyBuffer = 100, geometry, material, ...props },
    ref
  ) => {
    /* We're using useState because it gives better guarantees than useMemo. */
    const [particles] = useState(
      () => new ParticlesImpl(geometry, material, maxParticles, safetyBuffer)
    )

    /* Setup particles in an effect (after materials and geometry are assigned) */
    useEffect(() => {
      particles.setupParticles()
      return () => particles.dispose()
    }, [particles])

    useImperativeHandle(ref, () => particles)

    return <primitive object={particles} {...props} />
  }
)
