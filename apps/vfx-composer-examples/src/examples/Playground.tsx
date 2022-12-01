import { composable, modules } from "material-composer-r3f"
import { FrameTime, Mul } from "shader-composer"
import { Color } from "three"

export default function Playground() {
  return (
    <group>
      <mesh>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color color={Mul(new Color("hotpink"), FrameTime)} />
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
