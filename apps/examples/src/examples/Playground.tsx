import { useTexture } from "@react-three/drei"
import { useControls } from "leva"
import { useMemo } from "react"
import {
  Bool,
  CustomShaderMaterialMaster,
  Join,
  Multiply,
  Pipe,
  Sampler2D,
  Split,
  Subtract,
  TilingUV,
  Time,
  Uniform,
  UV,
  Vec2,
  Vec3,
  Vec4
} from "shadenfreude"
import {
  Color,
  DoubleSide,
  MeshStandardMaterial,
  RepeatWrapping,
  Vector2
} from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import textureUrl from "./textures/hexgrid.jpeg"
import { useShader } from "./useShader"

const SampleTexture = (name: string, t: Bool, xy: Vec2) =>
  Vec4(`texture2D(${name}, xy)`, { inputs: { t, xy } })

export default function Playground() {
  /* Load texture */
  const texture = useTexture(textureUrl)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping

  /* Set up Leva controls */
  const controls = useControls("Uniforms", {
    visibility: { value: 0.5, min: 0, max: 1 },
    edgeThickness: { value: 0.1, min: 0, max: 0.5 }
  })

  const { uniforms, ...shader } = useShader(() => {
    const parameters = {
      visibility: Uniform("float", "u_visibility"),
      edgeThickness: Uniform("float", "u_edgeThickness"),
      texture: Sampler2D("u_texture")
    }

    const animatedOffset = Join(Multiply(Time, -0.03), 0)

    const map = SampleTexture(
      "u_texture",
      parameters.texture,
      TilingUV(UV, new Vector2(3, 1.5), animatedOffset)
    )

    const splitMap = Split(map)

    const mapDiffuse = Join(splitMap[0], splitMap[1], splitMap[2])

    return CustomShaderMaterialMaster({
      diffuseColor: Pipe(Vec3(new Color("#4cf")), ($) =>
        Multiply($, mapDiffuse)
      )
    })
  }, [])

  const myUniforms = useMemo(
    () => ({
      ...uniforms,
      u_visibility: { value: controls.visibility },
      u_edgeThickness: { value: controls.edgeThickness },
      u_texture: { value: texture }
    }),
    []
  )

  myUniforms.u_visibility.value = controls.visibility
  myUniforms.u_edgeThickness.value = controls.edgeThickness

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[12, 8]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          uniforms={myUniforms}
          {...shader}
          transparent
          side={DoubleSide}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}
