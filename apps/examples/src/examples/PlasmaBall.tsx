import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Cos, Mul, Time } from "shader-composer"
import { DoubleSide, MeshStandardMaterial } from "three"

export default function PlasmaBallExample() {
  const time = Time()

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial
          baseMaterial={MeshStandardMaterial}
          transparent
          side={DoubleSide}
        >
          <Modules.DistortSurface
            offset={Mul(time, 0.5)}
            amplitude={Mul(Cos(time), 0.2)}
          />
          <Modules.Plasma offset={Mul(time, 0.3)} />
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
