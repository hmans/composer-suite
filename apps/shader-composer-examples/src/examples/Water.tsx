import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { patched } from "@material-composer/patched"
import { Environment } from "@react-three/drei"
import { pipe } from "fp-ts/function"
import { GlobalTime, Input, Int, Mul, Remap, Vec2 } from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Displacement, FBMNoise, GerstnerWave } from "shader-composer-toybox"
import { add } from "shader-composer/fun"
import { Color, DoubleSide } from "three"

const NormalizeNoise = (v: Input<"float">) => Remap(v, -1, 1, 0, 1)

function Water() {
  const shader = useShader(() => {
    const color = new Color("#acd")
    const time = GlobalTime

    const { position, normal } = Displacement((v) => {
      const { x, y, z } = v
      const xy = Vec2([x, z])

      /*
			The FBM noise layer is currently disabled because it doesn't work on
			Android for some reason.

			https://github.com/hmans/shader-composer/issues/29
			*/
      const fbm = NormalizeNoise(
        FBMNoise(Vec2([x, z]), {
          seed: Math.random(),
          persistance: 0.4,
          lacunarity: 2.3,
          scale: 0.4,
          redistribution: 1,
          octaves: Int(5),
          turbulence: false,
          ridge: false
        })
      )

      return pipe(
        v,
        add(Mul(GerstnerWave(xy, Vec2([1, 1]), 0.5, 20.0, time), 0.8)),
        add(Mul(GerstnerWave(xy, Vec2([0.2, 1]), 0.2, 10, time), 0.8)),
        add(Mul(GerstnerWave(xy, Vec2([0, -1]), 0.2, 5, time), 0.5)),
        add(Mul(GerstnerWave(xy, Vec2([1, 1]), 0.2, 8, time), 0.3))
        // add(Mul(vec3(0, 0.005, 0), fbm))
      )
    })

    return PatchedMaterialMaster({
      position,
      normal,
      color
    })
  })

  return (
    <mesh position-y={-12}>
      <boxGeometry args={[70, 16, 70, 120, 1, 120]} />
      <patched.meshPhysicalMaterial
        {...shader}
        roughness={0.1}
        metalness={0.5}
        side={DoubleSide}
      />
    </mesh>
  )
}

export default function WaterExample() {
  return (
    <group position-y={-3}>
      <Environment preset="sunset" />
      <Water />
    </group>
  )
}
