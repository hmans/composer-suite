import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { MeshStandardMaterial } from "three"
import { compileShader, float, makeShaderModule } from "three-shadermaker"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

const makeTime = ({ timeUniform = "u_time" } = {}) =>
  makeShaderModule({
    name: "time",
    uniforms: {
      [timeUniform]: { type: "float", value: 0 }
    }
  })

type WobbleProps = {
  timeUniform?: string
  axis?: "x" | "y" | "z"
  frequency?: number
  amplitude?: number
}

const makeWobble = ({
  timeUniform = "u_time",
  axis = "x",
  frequency = 1,
  amplitude = 1
}: WobbleProps = {}) =>
  makeShaderModule({
    name: "wobble",
    vertexMain: /*glsl*/ `
    csm_Position.${axis} += cos(${timeUniform}
       * ${float(frequency)}) * ${float(amplitude)};
    `
  })

export const ShaderMakerTest = () => {
  const material = useRef<CustomShaderMaterialImpl>(null!)

  /* pretty */
  const pretty = makeShaderModule({
    name: "pretty",
    fragmentMain: /*glsl*/ `csm_DiffuseColor = vec4(1.0, 0.3, 0.5, 1.0);`
  })

  /* Compile Shader */
  const shader = compileShader(
    makeTime(),
    pretty,
    makeWobble({ axis: "x", frequency: 7 }),
    makeWobble({ axis: "y", frequency: 5 }),
    makeWobble({ axis: "z", frequency: 3 })
  )

  /* Debug */
  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  /* Update time */
  useFrame((_, dt) => {
    material.current.uniforms.u_time.value += dt
  })

  return (
    <mesh position-y={8}>
      <sphereGeometry args={[5]} />
      <CustomShaderMaterial
        ref={material}
        baseMaterial={MeshStandardMaterial}
        {...shader}
      />
    </mesh>
  )
}
