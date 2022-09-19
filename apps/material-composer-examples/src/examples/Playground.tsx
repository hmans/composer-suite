import { Color, Layer, MaterialModules, modules } from "material-composer-r3f"
import { GlobalTime, Sin } from "shader-composer"

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />

        <meshStandardMaterial>
          <MaterialModules>
            <Color color="red" />

            <Layer opacity={Sin(GlobalTime)}>
              <Color color="yellow" />
            </Layer>
          </MaterialModules>
        </meshStandardMaterial>
      </mesh>
    </group>
  )
}
