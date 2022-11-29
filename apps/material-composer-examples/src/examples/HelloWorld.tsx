import { useControls } from "leva"
import { composable, Layer, modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useUniformUnit } from "@shader-composer/r3f"

export default function HelloWorld() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)

  return (
    <group>
      <mesh position-y={1.5} castShadow>
        <sphereGeometry args={[1, 64, 64]} />

        <composable.meshStandardMaterial>
          <modules.Color color="#d62828" />
          <Layer opacity={mix}>
            <modules.Color color="#003049" />
          </Layer>

          <modules.Fresnel intensity={0.2} />
        </composable.meshStandardMaterial>
      </mesh>

      <Description>
        A simple example with a material that can blend between two colors,
        steered by a uniform value.
      </Description>
    </group>
  )
}
