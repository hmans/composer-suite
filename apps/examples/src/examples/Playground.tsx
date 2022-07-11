import { useTexture } from "@react-three/drei"
import {
  code,
  CustomShaderMaterialMaster,
  Sampler2D,
  Texture2D,
  TilingUV,
  UV
} from "shadenfreude"
import { MeshStandardMaterial, RepeatWrapping, Vector2 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { Repeat } from "three-vfx"
import { DustExample } from "./DustExample"
import hexgrid from "./textures/hexgrid.jpeg"
import { useShader } from "./useShader"

export default function Playground() {
  const texture = useTexture(hexgrid)
  texture.wrapT = RepeatWrapping
  texture.wrapS = RepeatWrapping

  const shader = useShader(() => {
    const texture = Sampler2D("u_texture")

    const sampled = Texture2D(texture, TilingUV(UV, new Vector2(1.5, 1)))

    return CustomShaderMaterialMaster({
      diffuseColor: code`${sampled}.rgb`,
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
