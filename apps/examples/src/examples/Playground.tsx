import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Mul, Time } from "shader-composer"
import { Color, MeshStandardMaterial } from "three"

export default function Playground() {
  return (
    <group>
      <mesh>
        <sphereGeometry />
        <ComposableMaterial baseMaterial={MeshStandardMaterial}>
          <Modules.Color color={Mul(new Color("hotpink"), Time())} />
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
