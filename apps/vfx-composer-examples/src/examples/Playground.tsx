import { composable, modules } from "material-composer-r3f"
import { GlobalTime, Mul, NormalizePlusMinusOne, Sin } from "shader-composer"
import { Color } from "three"

export default function Playground() {
  return (
    <group>
      <mesh position-x={-2}>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color
            color={Mul(
              new Color("hotpink"),
              NormalizePlusMinusOne(Sin(GlobalTime))
            )}
          />
        </composable.meshStandardMaterial>
      </mesh>

      <mesh position-x={2}>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color
            color={Mul(
              new Color("cyan"),
              NormalizePlusMinusOne(Sin(GlobalTime))
            )}
          />
        </composable.meshStandardMaterial>
      </mesh>

      <mesh position-y={2}>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color
            color={Mul(
              new Color("red"),
              NormalizePlusMinusOne(Sin(GlobalTime))
            )}
          />
        </composable.meshStandardMaterial>
      </mesh>

      <mesh position-y={-2}>
        <sphereGeometry />
        <composable.meshStandardMaterial>
          <modules.Color
            color={Mul(
              new Color("white"),
              NormalizePlusMinusOne(Sin(GlobalTime))
            )}
          />
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
