import CustomShaderMaterial from "three-custom-shader-material"
import { MeshStandardMaterial } from "three"
import { compileShader, makeShaderModule } from "three-shadermaker"

export const ShaderMakerTest = () => {
  /* time */
  const time = makeShaderModule({
    uniforms: {
      u_time: { type: "float", value: 0 }
    }
  })

  /* pretty */
  const pretty = makeShaderModule({
    fragmentMain: /*glsl*/ `csm_DiffuseColor = vec4(1.0, 0.3, 0.5, 1.0);`
  })

  /* Compile Shader */
  const { vertexShader, fragmentShader } = compileShader(time, pretty)

  /* Debug */
  console.log(vertexShader)
  console.log(fragmentShader)

  return (
    <mesh position-y={8} scale={6}>
      <sphereGeometry />
      <CustomShaderMaterial
        baseMaterial={MeshStandardMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
