import { MeshStandardMaterial } from "three"
import { VFXMaterial } from "vfx-composer-r3f"

export default function FireballExample() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />
        <VFXMaterial baseMaterial={MeshStandardMaterial} color="yellow" />
      </mesh>
    </group>
  )
}
