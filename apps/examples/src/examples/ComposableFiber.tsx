import { extend, Node } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { MeshStandardMaterial } from "three"
import { MeshParticles } from "./v2/fiber"
import {
  MeshParticles as MeshParticlesImpl,
  ParticlesMaterial as ParticlesMaterialImpl
} from "./v2/vanilla"

extend({ ParticlesMaterial: ParticlesMaterialImpl })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      particlesMaterial: Node<
        ParticlesMaterialImpl,
        typeof ParticlesMaterialImpl
      >
    }
  }
}

export const ComposableFiber = () => {
  const ref = useRef<MeshParticlesImpl>(null!)

  useEffect(() => {
    ref.current.spawnParticle()
  })

  return (
    <MeshParticles ref={ref}>
      <sphereGeometry />
      <particlesMaterial args={[{ baseMaterial: MeshStandardMaterial }]} />
    </MeshParticles>
  )
}
