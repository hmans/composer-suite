import { useControls } from "leva"
import { composable, modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useMemo } from "react"
import { GlobalTime, Rotation3D, Time, Vec3 } from "shader-composer"

export default function Rotate() {
  const controls = useControls({
    space: { value: "world", options: ["local", "world", "view"] }
  })

  const time = useMemo(() => Time(), [])

  return (
    <group>
      <mesh position-y={1.5} rotation-z={Math.PI / 2}>
        <boxGeometry />

        <composable.meshStandardMaterial>
          <modules.Rotate rotation={Rotation3D(Vec3([1, 1, 0]), GlobalTime)} />
        </composable.meshStandardMaterial>
      </mesh>

      <Description>
        The <strong>Rotate</strong> module applies a rotation to the object's
        vertices.
      </Description>
    </group>
  )
}
