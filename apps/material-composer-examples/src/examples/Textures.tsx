import { useTexture } from "@react-three/drei"
import { useControls } from "leva"
import { composable, Layer, modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { Mul, Time, UV } from "shader-composer"
import { useUniformUnit } from "shader-composer/r3f"
import textureUrl from "./textures/hexgrid.jpeg"

export default function Textures() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)
  const texture = useTexture(textureUrl)

  const textureUniform = useUniformUnit("sampler2D", texture)

  return (
    <group>
      <mesh position-y={1.5} castShadow>
        <sphereGeometry args={[1, 64, 64]} />

        <composable.meshStandardMaterial color="hotpink">
          <Layer opacity={mix}>
            <modules.Texture texture={texture} />
          </Layer>
        </composable.meshStandardMaterial>
      </mesh>

      <Description>
        A simple example with a material that can blend between two colors,
        steered by a uniform value.
      </Description>
    </group>
  )
}
