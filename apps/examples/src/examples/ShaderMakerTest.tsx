import CustomShaderMaterial from "three-custom-shader-material"
import { MeshStandardMaterial } from "three"
import { compileShader, makeShaderModule } from "three-shadermaker"

export const ShaderMakerTest = () => {
  const pretty = makeShaderModule({
    fragmentMain: /*glsl*/ `csm_DiffuseColor = vec4(1.0, 0.3, 0.5, 1.0);`
  })

  const shaders = compileShader(pretty)

  console.log(shaders.vertexShader)
  console.log(shaders.fragmentShader)

  return (
    <mesh position-y={8} scale={6}>
      <sphereGeometry />
      <CustomShaderMaterial baseMaterial={MeshStandardMaterial} {...shaders} />
    </mesh>
  )
}
