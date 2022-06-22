import CustomShaderMaterial from "three-custom-shader-material"
import { MeshStandardMaterial } from "three"
import { compileShader, createShader } from "three-vfx"

export const NewShaderExample = () => {
  const shader = createShader({
    fragmentMain: `csm_DiffuseColor = vec4(1.0, 0.5, 0.0, 1.0);`
  })

  const material = compileShader(shader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8]} />
        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          color="hotpink"
          {...material}
        />
      </mesh>
    </group>
  )
}
