import { composable, modules } from "material-composer-r3f"
import { Mul, Time } from "shader-composer"
import { Color } from "three"

export default function Playground() {
  return (
    <group>
      <mesh position-x={-2}>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color color={Mul(new Color("hotpink"), Time())} />
        </composable.meshStandardMaterial>
      </mesh>
      <mesh position-x={+2}>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color color={Mul(new Color("hotpink"), Time())} />
        </composable.meshStandardMaterial>
      </mesh>
      <mesh position-y={-2}>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color color={Mul(new Color("hotpink"), Time())} />
        </composable.meshStandardMaterial>
      </mesh>
      <mesh position-y={+2}>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color color={Mul(new Color("hotpink"), Time())} />
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
