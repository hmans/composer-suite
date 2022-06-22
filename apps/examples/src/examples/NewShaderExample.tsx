import CustomShaderMaterial from "three-custom-shader-material"
import { MeshStandardMaterial } from "three"

export const NewShaderExample = () => {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8]} />
        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          color="hotpink"
        />
      </mesh>
    </group>
  )
}
