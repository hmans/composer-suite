import { useTexture } from "@react-three/drei"
import { Mul, Texture2D, Time, vec2, vec3 } from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { MeshStandardMaterial } from "three"
import { VFX, VFXMaterial } from "vfx-composer-r3f"

import textureUrl from "./textures/explosion.png"

export default function FireballExample() {
  const sampler = useUniformUnit("sampler2D", useTexture(textureUrl))
  const time = Time()

  return (
    <group position-y={1.5}>
      <directionalLight intensity={1} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <VFXMaterial baseMaterial={MeshStandardMaterial}>
          <VFX.DistortSurface offset={Mul(time, 0.4)} amplitude={0.1} />

          <VFX.Lava
            offset={Mul(vec3(0.1, 0.2, 0.5), time)}
            scale={0.4}
            octaves={5}
            color={(heat) => Texture2D(sampler, vec2(0, heat)).color}
          />
        </VFXMaterial>
      </mesh>
    </group>
  )
}
