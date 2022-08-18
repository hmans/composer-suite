import { Color, MeshStandardMaterial } from "three"
import { VFX, VFXMaterial } from "vfx-composer-r3f"

export default function FireballExample() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <VFXMaterial baseMaterial={MeshStandardMaterial}>
          <VFX.SetColor color={new Color("#f4a261")} />
        </VFXMaterial>
      </mesh>
    </group>
  )
}
