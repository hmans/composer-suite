import { Environment } from "@react-three/drei"
import {
  add,
  CustomShaderMaterialMaster,
  GlobalTime,
  Input,
  Int,
  Mul,
  pipe,
  Remap,
  SplitVector3,
  vec2
} from "shader-composer"
import { Custom, useShader } from "shader-composer-r3f"
import { Displacement, FBMNoise, GerstnerWave } from "shader-composer-toybox"
import { Color, DoubleSide } from "three"

const NormalizeNoise = (v: Input<"float">) => Remap(v, -1, 1, 0, 1)

function Water() {
  const shader = useShader(() => {
    const diffuseColor = new Color("#acd")
    const time = GlobalTime

    const { position, normal } = Displacement((v) => {
      const [x, y, z] = SplitVector3(v)
      const xy = vec2(x, z)

      /*
			The FBM noise layer is currently disabled because it doesn't work on
			Android for some reason.

			https://github.com/hmans/shader-composer/issues/29
			*/
      const fbm = NormalizeNoise(
        FBMNoise(vec2(x, z), {
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
        add(Mul(GerstnerWave(xy, vec2(1, 1), 0.5, 20.0, time), 0.8)),
        add(Mul(GerstnerWave(xy, vec2(0.2, 1), 0.2, 10, time), 0.8)),
        add(Mul(GerstnerWave(xy, vec2(0, -1), 0.2, 5, time), 0.5)),
        add(Mul(GerstnerWave(xy, vec2(1, 1), 0.2, 8, time), 0.3))
        // add(Mul(vec3(0, 0.005, 0), fbm))
      )
    })

    return CustomShaderMaterialMaster({
      position,
      normal,
      diffuseColor
    })
  })

  return (
    <mesh position-y={-12}>
      <boxGeometry args={[70, 16, 70, 120, 1, 120]} />
      <Custom.MeshPhysicalMaterial
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
