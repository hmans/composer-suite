import { useControls } from "leva"
import { useRef } from "react"
import {
  add,
  BlendNode,
  CustomShaderMaterialMasterNode,
  FresnelNode,
  JoinVector3Node,
  multiply,
  sin,
  SplitVector3Node,
  TimeNode,
  UniformNode,
  VertexPositionNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { useShader } from "./useShader"

export default function StacksExample() {
  const { speed, intensity, color, fresnelIntensity } = useControls(
    "Uniforms",
    {
      speed: { value: 1, min: 0, max: 2 },
      intensity: { value: 1, min: 0, max: 2 },
      color: "#3dd",
      fresnelIntensity: { value: 2, min: 0, max: 5 }
    }
  )

  const shader = useShader(() => {
    const speedUniform = UniformNode({ type: "float", name: "u_speed" })
    const intensityUniform = UniformNode({ type: "float", name: "u_intensity" })
    const colorUniform = UniformNode({ type: "vec3", name: "u_color" })
    const fresnelIntensityUniform = UniformNode({
      type: "float",
      name: "u_fresnelIntensity"
    })

    const time = TimeNode()
    const position = SplitVector3Node({ a: VertexPositionNode() })
    const { x, y, z } = position.outputs

    const scaledTime = (scale = 1) => multiply(time, speedUniform, scale)

    const wobble = (frequency = 1, amplitude = 1) =>
      multiply(sin(scaledTime(frequency)), amplitude, intensityUniform)

    const shift = (frequency = 1, amplitude = 1) =>
      multiply(sin(scaledTime(frequency)), amplitude, intensityUniform)

    const root = CustomShaderMaterialMasterNode({
      position: JoinVector3Node({
        x: add(x, multiply(x, multiply(y, 0.1), wobble(2, 0.2)), shift(0.5, 5)),
        y: add(
          y,
          multiply(y, multiply(x, 0.2), wobble(1.1, 0.1)),
          shift(1.1, 4)
        ),
        z: add(z, multiply(z, wobble(1.5, 0.3)), shift(0.8, 2))
      }),

      diffuseColor: BlendNode({
        mode: "softlight",
        opacity: 1,
        a: colorUniform,
        b: multiply(
          multiply(new Color(2, 2, 2), fresnelIntensityUniform),
          FresnelNode()
        )
      })
    })

    return root
  }, [])

  const material = useRef<CustomShaderMaterialImpl>(null!)

  const { uniforms, ...restShader } = shader

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 48, 48]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          uniforms={{
            ...uniforms,
            u_speed: { value: speed },
            u_intensity: { value: intensity },
            u_color: { value: new Color(color) },
            u_fresnelIntensity: { value: fresnelIntensity }
          }}
          {...restShader}
          ref={material}
        />
      </mesh>
    </group>
  )
}
