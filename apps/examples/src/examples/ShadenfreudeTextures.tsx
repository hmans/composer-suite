import { useTexture } from "@react-three/drei"
import {
  Add,
  code,
  CustomShaderMaterialMaster,
  Fresnel,
  Mul,
  Sampler2D,
  Texture2D,
  TilingUV,
  UV,
  Vec3
} from "shadenfreude"
import { Color, MeshStandardMaterial, RepeatWrapping, Vector2 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { DustExample } from "./DustExample"
import hexgrid from "./textures/hexgrid.jpeg"
import { useShader } from "./useShader"

export default function ShadenfreudeTextures() {
  const texture = useTexture(hexgrid)
  texture.wrapT = RepeatWrapping
  texture.wrapS = RepeatWrapping

  const shader = useShader(() => {
    const texture = Sampler2D("u_texture")
    const sampled = Texture2D(texture, TilingUV(UV, new Vector2(1.5, 1)))
    const textureColor = Vec3(code`${sampled}.rgb`)

    return CustomShaderMaterialMaster({
      diffuseColor: Add(
        Mul(textureColor, new Color("#89c")),
        Mul(new Color("white"), Fresnel({ intensity: 0.75 }))
      ),

      alpha: code`${sampled}.a`
    })
  }, [])

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={10}>
      {/* <Fog /> */}
      <DustExample />
      <mesh>
        <icosahedronGeometry args={[10, 3]} />
        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          uniforms={{ ...shader.uniforms, u_texture: { value: texture } }}
        />
      </mesh>
    </group>
  )
}
