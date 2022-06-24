import { MeshStandardMaterial } from "three"
import { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterial from "three-custom-shader-material"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  return <CustomShaderMaterial {...props} />
}

export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[7]} />

        <MyMaterial
          color="red"
          baseMaterial={MeshStandardMaterial}
        ></MyMaterial>
      </mesh>
    </group>
  )
}
