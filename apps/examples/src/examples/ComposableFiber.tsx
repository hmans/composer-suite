import { MeshStandardMaterial } from "three"
import { MeshParticles } from "./v2/fiber"

export const ComposableFiber = () => {
  return (
    <MeshParticles>
      <sphereGeometry />
      <particlesMaterial args={[{ baseMaterial: MeshStandardMaterial }]} />
    </MeshParticles>
  )
}
