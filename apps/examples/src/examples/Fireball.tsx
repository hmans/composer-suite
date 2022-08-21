import { Input, Mul, Time, vec3 } from "shader-composer"
import { MeshStandardMaterial } from "three"
import { VFX, VFXMaterial } from "vfx-composer-r3f"
import { sharedResource } from "./lib/sharedResource"

const LavaMaterial = sharedResource(
  ({ time = Time() }: { time?: Input<"float"> }) => {
    return (
      <VFXMaterial baseMaterial={MeshStandardMaterial}>
        <VFX.DistortSurface offset={Mul(time, 0.4)} amplitude={0.1} />

        <VFX.Lava
          offset={Mul(vec3(0.1, 0.2, 0.5), time)}
          scale={0.3}
          octaves={5}
          power={1}
        />
      </VFXMaterial>
    )
  }
)

export default function FireballExample() {
  return (
    <group position-y={1.5}>
      <LavaMaterial.Resource time={Mul(Time(), 0.1)} />

      <mesh position-x={-1.5}>
        <icosahedronGeometry args={[1, 8]} />
        <LavaMaterial />
      </mesh>

      <mesh position-x={+1.5}>
        <icosahedronGeometry args={[1, 8]} />
        <LavaMaterial />
      </mesh>
    </group>
  )
}
