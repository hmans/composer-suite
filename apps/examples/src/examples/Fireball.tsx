import { Mul, Time, vec3 } from "shader-composer"
import { MeshStandardMaterial } from "three"
import { Modules, ComposableMaterial } from "material-composer-r3f"

export default function FireballExample() {
  const time = Time()

  return (
    <group position-y={1.5}>
      {/* <directionalLight intensity={0.8} position={[20, 10, 10]} /> */}

      <mesh castShadow>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial baseMaterial={MeshStandardMaterial}>
          <Modules.DistortSurface offset={Mul(time, 0.4)} amplitude={0.1} />

          <Modules.Lava
            offset={Mul(vec3(0.1, 0.2, 0.5), time)}
            scale={0.3}
            octaves={5}
            power={1}
          />
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
