import { composable, modules } from "material-composer-r3f"
import { Mul, Time } from "shader-composer"
import { Color } from "three"

export default function Playground() {
  return (
    <group>
      <mesh>
        <sphereGeometry />
        <composable.MeshStandardMaterial>
          <modules.Color color={Mul(new Color("hotpink"), Time())} />
        </composable.MeshStandardMaterial>
      </mesh>
    </group>
  )
}
