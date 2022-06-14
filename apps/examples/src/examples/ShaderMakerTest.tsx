import { Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Color, MeshStandardMaterial } from "three"
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

const makeStaticFresnel = ({
  color = "vec3(1.0)",
  alpha = 1,
  bias = 0.1,
  intensity = 1,
  power = 2,
  factor = 1,
  target = "csm_FragColor"
} = {}) =>
  makeShaderModule({
    varyings: {
      v_worldPosition: {
        type: "vec3",
        value: "vec3(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2])"
      },
      v_worldNormal: {
        type: "vec3",
        value:
          "normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal)"
      }
    },

    fragmentMain: `
    float f_a = (${float(factor)}  + dot(v_worldPosition, v_worldNormal));
    float f_fresnel = ${float(bias)} + ${float(
      intensity
    )} * pow(abs(f_a), ${float(power)});
    f_fresnel = clamp(f_fresnel, 0.0, 1.0);
    ${target} = vec4(f_fresnel * ${color}, ${float(alpha)});
  `
  })

// const makeFresnel = () =>
//   makeShaderModule({
//     ...makeStaticFresnel(),

//     uniforms: {
//       u_color: { type: "vec3", value: new Color("white") },
//       u_alpha: { type: "float", value: 1 },
//       u_bias: { type: "float", value: 0.1 },
//       u_intensity: { type: "float", value: 1 },
//       u_power: { type: "float", value: 2 },
//       u_factor: { type: "float", value: 1 }
//     },
//   })

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
    makeStaticFresnel(),
    wobbleScale(),
    makeWobble({ axis: "x", frequency: 7 }),
    makeWobble({ axis: "y", frequency: 5 }),
    makeWobble({ axis: "z", frequency: 3 })
  )

  console.log(shader.uniforms)

  /* Update time */
  useFrame((_, dt) => callback(material.current, dt))

  /* Debug */
  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <mesh position-y={8}>
      <sphereGeometry args={[5]} />
      {/* <dodecahedronGeometry args={[7]} /> */}
      <CustomShaderMaterial
        baseMaterial={MeshStandardMaterial}
        {...shader}
        ref={material}
      />
    </mesh>
  )
}
