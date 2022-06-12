import { useEffect, useRef } from "react"
import { MeshStandardMaterial } from "three"
import { MeshParticles } from "./v2/fiber"
import { MeshParticles as MeshParticlesImpl } from "./v2/vanilla"

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
