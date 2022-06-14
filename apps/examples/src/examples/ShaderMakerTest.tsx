import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { MeshStandardMaterial } from "three"
import { compileShader, makeShaderModule } from "three-shadermaker"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export const ShaderMakerTest = () => {
  const material = useRef<CustomShaderMaterialImpl>(null!)

  /* time */
  const time = makeShaderModule({
    name: "time",
    uniforms: {
      u_time: { type: "float", value: 0 }
    }
  })

  /* pretty */
  const pretty = makeShaderModule({
    name: "pretty",
    fragmentMain: /*glsl*/ `csm_DiffuseColor = vec4(1.0, 0.3, 0.5, 1.0);`
  })

  /* wobble */
  const wobble = makeShaderModule({
    name: "wobble",
    vertexMain: /*glsl*/ `csm_Position += vec3(cos(u_time * 7.0), sin(u_time * 5.0), 0.0);`
  })

  /* Compile Shader */
  const shader = compileShader(time, pretty, wobble)

  /* Debug */
  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  /* Update time */
  useFrame((_, dt) => {
    material.current.uniforms.u_time.value += dt
  })

  return (
    <mesh position-y={8} scale={6}>
      <sphereGeometry />
      <CustomShaderMaterial
        ref={material}
        baseMaterial={MeshStandardMaterial}
        {...shader}
      />
    </mesh>
  )
}
