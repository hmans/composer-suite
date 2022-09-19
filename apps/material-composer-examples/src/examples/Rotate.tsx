import { MaterialModules, Rotate } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { GlobalTime, Rotation3D, Vec3 } from "shader-composer"

export default function RotateExample() {
  return (
    <group>
      <mesh position-y={1.5} rotation-z={Math.PI / 2}>
        <boxGeometry />

        <meshStandardMaterial>
          <MaterialModules>
            <Rotate rotation={Rotation3D(Vec3([1, 1, 0]), GlobalTime)} />
          </MaterialModules>
        </meshStandardMaterial>
      </mesh>

      <Description>
        The <strong>Rotate</strong> module applies a rotation to the object's
        vertices.
      </Description>
    </group>
  )
}
