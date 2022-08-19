import { Cos, Mul, Time, vec3 } from "shader-composer"
import { MeshStandardMaterial, DoubleSide } from "three"
import { VFX, VFXMaterial } from "vfx-composer-r3f"

export default function PlasmaBallExample() {
  const time = Time()

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />
        {/* <torusKnotGeometry args={[1, 0.3]} /> */}

        <VFXMaterial
          baseMaterial={MeshStandardMaterial}
          transparent
          side={DoubleSide}
        >
          <VFX.DistortSurface
            offset={Mul(time, 0.5)}
            amplitude={Mul(Cos(time), 0.2)}
          />
          <VFX.Plasma offset={Mul(time, 0.3)} />
        </VFXMaterial>
      </mesh>
    </group>
  )
}
