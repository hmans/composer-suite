import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { patched } from "@material-composer/patched"
import { useTexture } from "@react-three/drei"
import {
  Add,
  GlobalTime,
  Mul,
  Sin,
  UV,
  vec3,
  VertexPosition
} from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { DoubleSide } from "three"
import textureUrl from "./textures/shader-composer-logo.jpg"

export default function Flag() {
  const texture = useTexture(textureUrl)

  const shader = useShader(() => {
    const time = GlobalTime

    return PatchedMaterialMaster({
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
      <patched.meshStandardMaterial
        map={texture}
        side={DoubleSide}
        {...shader}
      />
    </mesh>
  )
}
