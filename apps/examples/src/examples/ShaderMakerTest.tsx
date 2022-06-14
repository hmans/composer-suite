import CustomShaderMaterial from "three-custom-shader-material"
import { MeshStandardMaterial } from "three"

export const ShaderMakerTest = () => {
  const shaders = {
    fragmentShader: /*glsl*/ `
    void main() {
      csm_DiffuseColor = vec4(1.0, 0.3, 0.5, 1.0);
    }`
  }

  return (
    <mesh position-y={8} scale={6}>
      <sphereGeometry />
      <CustomShaderMaterial baseMaterial={MeshStandardMaterial} {...shaders} />
    </mesh>
  )
}
