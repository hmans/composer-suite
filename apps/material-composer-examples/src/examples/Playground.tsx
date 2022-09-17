import { useControls } from "leva"
import { composable, Layer, modules } from "material-composer-r3f"
import { Fresnel } from "shader-composer"
import { Color } from "three"

export default function Playground() {
  const controls = useControls({ scale: { value: 1, min: 0, max: 2 } })

  return (
    <group position-y={1.5}>
      <mesh scale={controls.scale}>
        <sphereGeometry args={[1, 32, 32]} />

        <composable.meshStandardMaterial>
          <modules.Color color={new Color("hotpink")} />
          {/* <modules.Fresnel /> */}

          <Layer opacity={Fresnel({ power: 2 })}>
            <modules.Color color={new Color("white").multiplyScalar(4)} />
          </Layer>
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
