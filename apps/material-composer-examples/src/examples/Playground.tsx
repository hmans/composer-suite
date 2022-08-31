import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { useControls } from "leva"
import { patched } from "material-composer-r3f"
import { Lerp, NormalizePlusMinusOne, Sin, Time } from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Color } from "three"

export default function Playground() {
  useControls({ foo: { value: 1, min: 0, max: 2 } })

  const shader = useShader(() => {
    return PatchedMaterialMaster({
      color: Lerp(
        new Color("white"),
        new Color("blue"),
        NormalizePlusMinusOne(Sin(Time()))
      ),
      metalness: 0.5,
      roughness: 0.5
    })
  }, [])

  const otherShader = useShader(() => {
    return PatchedMaterialMaster({
      color: Lerp(
        new Color("red"),
        new Color("green"),
        NormalizePlusMinusOne(Sin(Time()))
      ),
      metalness: 0.5,
      roughness: 0.5
    })
  }, [])

  return (
    <group position-y={1.5}>
      <mesh castShadow position-x={-1.5}>
        <patched.meshStandardMaterial {...shader} />
        <sphereGeometry />
      </mesh>

      <mesh castShadow position-x={+1.5}>
        <patched.meshStandardMaterial {...otherShader} />
        <sphereGeometry />
      </mesh>
    </group>
  )
}

// import { useControls } from "leva"
// import { composable, modules } from "material-composer-r3f"
// import { ModuleRegistrationContext } from "material-composer-r3f/src/moduleRegistration"

// export default function Playground() {
//   useControls({ foo: { value: 1, min: 0, max: 2 } })

//   return (
//     <group position-y={1.5}>
//       <mesh castShadow position-x={-1.5}>
//         <composable.meshStandardMaterial>
//           <modules.Color color="yellow" />
//         </composable.meshStandardMaterial>
//         <sphereGeometry />
//       </mesh>

//       <mesh castShadow position-x={+1.5}>
//         <composable.meshStandardMaterial>
//           <modules.Color color="red" />
//         </composable.meshStandardMaterial>
//         <sphereGeometry />
//       </mesh>
//     </group>
//   )
// }
