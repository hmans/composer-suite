import { useTexture } from "@react-three/drei"
import {
  Add,
  GlobalTime,
  Mul,
  Sin,
  UV,
  Vec3,
  VertexPosition
} from "shader-composer"
import { Shader, ShaderMaster, useShader } from "@shader-composer/r3f"
import { DoubleSide } from "three"
import textureUrl from "./textures/shader-composer-logo.jpg"

export default function Flag() {
  const texture = useTexture(textureUrl)

  const shader = useShader(() => {
    const time = GlobalTime

    return ShaderMaster({
      position: Vec3([
        VertexPosition.x,
        VertexPosition.y,
        Mul(Sin(Add(Mul(time, 2), Add(Mul(UV.y, 8), Mul(UV.x, 14)))), 0.2)
      ])
    })
  }, [])

  return (
    <mesh>
      <planeGeometry args={[4, 2, 40, 20]} />
      <meshStandardMaterial map={texture} side={DoubleSide}>
        <Shader {...shader} />
      </meshStandardMaterial>
    </mesh>
  )
}
