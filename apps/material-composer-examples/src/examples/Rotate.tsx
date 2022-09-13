import { useControls } from "leva"
import { composable, modules } from "material-composer-r3f"
import { Space } from "material-composer/modules"
import { Description } from "r3f-stage"
import { useMemo } from "react"
import { Mul, Sin, Time } from "shader-composer"
import { Vector3 } from "three"

export default function Rotate() {
  const controls = useControls({
    space: { value: "world", options: ["local", "world", "view"] }
  })

  const time = useMemo(() => Time(), [])

  return (
    <group>
      <mesh position-y={1.5} rotation-z={Math.PI / 2}>
        <sphereGeometry />

        <composable.meshStandardMaterial>
          <modules.Translate
            offset={Mul(new Vector3(1, 0, 0), Sin(time))}
            space={controls.space as Space}
          />
        </composable.meshStandardMaterial>
      </mesh>

      <Description>
        The <strong>Translate</strong> module translates (moves) vertices by a
        given offset.
      </Description>
    </group>
  )
}
