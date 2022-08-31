import { useTexture } from "@react-three/drei"
import {
  Add,
  CustomShaderMaterialMaster,
  Mul,
  Sin,
  Time,
  UV,
  vec3,
  VertexPosition
} from "shader-composer"
import { Custom, useShader } from "shader-composer-r3f"
import { DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import textureUrl from "./textures/shader-composer-logo.jpg"

export default function Flag() {
  const texture = useTexture(textureUrl)

  const shader = useShader(() => {
    const time = Time()

    return CustomShaderMaterialMaster({
      position: vec3(
        VertexPosition.x,
        VertexPosition.y,
        Mul(Sin(Add(Mul(time, 2), Add(Mul(UV.y, 8), Mul(UV.x, 14)))), 0.2)
      )
    })
  }, [])

  return (
    <mesh>
      <planeGeometry args={[4, 2, 40, 20]} />
      <Custom.MeshStandardMaterial map={texture} side={DoubleSide} {...shader} />
    </mesh>
  )
}
