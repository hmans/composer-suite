import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { compileShader, float, makeShaderModule } from "three-shadermaker"

const makeTime = ({ timeUniform = "u_time" } = {}) =>
  makeShaderModule({
    name: "time",

    uniforms: {
      [timeUniform]: { type: "float", value: 0 }
    },

    frameCallback: (material, dt) =>
      (material.uniforms[timeUniform].value += dt)
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

const wobbleScale = () =>
  makeShaderModule({
    name: "wobbleScale",
    vertexMain: /*glsl*/ `
      float t = smoothstep(0.0, 1.0, abs(sin(u_time)));
      float scale = mix(0.5, 1.0, t);
      csm_Position *= scale;
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
  const { callback, ...shader } = compileShader(
    makeTime(),
    pretty,
    wobbleScale(),
    makeWobble({ axis: "x", frequency: 7 }),
    makeWobble({ axis: "y", frequency: 5 }),
    makeWobble({ axis: "z", frequency: 3 })
  )

  /* Update time */
  useFrame((_, dt) => callback(material.current, dt))

  /* Debug */
  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <mesh position-y={8}>
      <sphereGeometry args={[5]} />
      <CustomShaderMaterial
        baseMaterial={MeshStandardMaterial}
        {...shader}
        ref={material}
      />
    </mesh>
  )
}
