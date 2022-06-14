import CustomShaderMaterial from "three-custom-shader-material"
import { MeshStandardMaterial } from "three"
import { compileShader, ShaderModule } from "three-shadermaker"

export const ShaderMakerTest = () => {
  const config: ShaderModule = {
    fragmentHeader: "",
    fragmentMain: /*glsl*/ `csm_DiffuseColor = vec4(1.0, 0.3, 0.5, 1.0);`,
    vertexHeader: "",
    vertexMain: ""
  }

  const shaders = compileShader(config)

  return (
    <mesh position-y={8} scale={6}>
      <sphereGeometry />
      <CustomShaderMaterial baseMaterial={MeshStandardMaterial} {...shaders} />
    </mesh>
  )
}
