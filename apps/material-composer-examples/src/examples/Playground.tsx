import * as MC from "material-composer-r3f"
import { Color } from "three"

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />

        <MC.composable.meshStandardMaterial>
          <MC.Color color="hotpink" />
          <MC.Module
            module={(state) => ({ ...state, color: new Color("blue") })}
          />
        </MC.composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
