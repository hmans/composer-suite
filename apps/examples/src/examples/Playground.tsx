import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useMemo } from "react"
import {
  Add,
  compileShader,
  CustomShaderMaterialMaster,
  Dissolve,
  Uniform,
  Value,
  Vec2,
  Vec4
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import textureUrl from "./textures/hexgrid.jpeg"

const SampleTexture = (t: Value<"sampler2D">, xy: Vec2) =>
  Vec4("texture2D(t, xy)", { inputs: { t, xy } })

export default function Playground() {
  const texture = useTexture(textureUrl)

  const controls = useControls("Uniforms", {
    visibility: { value: 0.5, min: 0, max: 1 },
    edgeThickness: { value: 0.1, min: 0, max: 0.5 }
  })

  const [{ uniforms, ...shader }, update] = useMemo(() => {
    console.log("compiling shader")

    const parameters = {
      visibility: Uniform("float", "u_visibility"),
      edgeThickness: Uniform("float", "u_edgeThickness"),
      texture: Uniform("sampler2D", "u_texture")
    }

    /* Use the thing: */
    const dissolve = Dissolve(
      parameters.visibility,
      0.3,
      parameters.edgeThickness
    )

    const root = CustomShaderMaterialMaster({
      diffuseColor: Add(new Color("#666"), dissolve.color),
      alpha: dissolve.alpha
    })

    return compileShader(root)
  }, [])

  useFrame((_, dt) => update(dt))

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[12, 8]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          uniforms={{
            u_visibility: { value: controls.visibility },
            u_edgeThickness: { value: controls.edgeThickness },
            u_texture: { value: texture },
            ...uniforms
          }}
          {...shader}
          transparent
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}
