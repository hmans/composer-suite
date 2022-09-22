import { composable, modules } from "material-composer-r3f"
import { Mul, Time } from "shader-composer"
import { Color } from "three"

export default function ControlledParticlesExample() {
  return (
    <group>
      <mesh>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color color={Mul(new Color("hotpink"), Time())} />
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
