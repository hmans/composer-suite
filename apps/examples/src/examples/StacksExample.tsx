import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useMemo, useRef } from "react"
import {
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  IShaderNode,
  MultiplyNode,
  Parameter,
  SoftlightBlendNode,
  StackNode,
  TimeNode,
  UniformNode,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { AmbientLightProbe, Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

const ScaleWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Scale with Time",
    in: {
      a: vec3(),
      frequency: float(1),
      amplitude: float(0.5),
      time: float(TimeNode())
    },
    out: {
      value: vec3("in_a")
    },
    vertex: {
      body: `out_value.${axis} *= (1.0 + sin(in_time * in_frequency) * in_amplitude);`
    }
  }))

const SqueezeWithTime = Factory(() => ({
  name: "Squeeze with Time",
  in: {
    a: vec3(),

    frequency: float(1),
    amplitude: float(0.3),
    time: float(TimeNode())
  },
  out: {
    value: vec3("in_a")
  },
  vertex: {
    body: `out_value.x *= (
      1.0 + sin(in_time * in_frequency
        + position.y * 0.3 * in_frequency
        + position.x * 0.3 * in_frequency) * in_amplitude);`
  }
}))

const MoveWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Move with Time",
    in: {
      a: vec3(),
      frequency: float(1),
      amplitude: float(1),
      time: float(TimeNode())
    },
    out: {
      value: vec3("in_a")
    },
    vertex: {
      body: `out_value.${axis} += sin(in_time * in_frequency) * in_amplitude;`
    }
  }))

function useShader(ctor: () => IShaderNode, deps?: any[]) {
  const [shader, update] = useMemo(() => {
    console.log("Recompiling shader")
    return compileShader(ctor())
  }, deps)
  useFrame((_, dt) => update(dt))
  return shader
}

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
    const AnimationStack = StackNode("vec3", "Animation Stack")
    const ColorStack = StackNode("vec3", "Color Stack")

    const speedUniform = UniformNode({ type: "float", name: "u_speed" })

    const root = CustomShaderMaterialMasterNode({
      position: AnimationStack(VertexPositionNode(), [
        SqueezeWithTime({
          frequency: speedUniform,
          amplitude: 0.5 * intensity
        }),
        ScaleWithTime("x")({
          frequency: speedUniform,
          amplitude: 0.5 * intensity
        }),
        ScaleWithTime("y")({
          frequency: speedUniform,
          amplitude: 0.5 * intensity
        }),
        ScaleWithTime("z")({
          frequency: speedUniform,
          amplitude: 0.5 * intensity
        }),
        MoveWithTime("x")({
          frequency: speedUniform,
          amplitude: 2 * intensity
        }),
        MoveWithTime("y")({
          frequency: speedUniform,
          amplitude: 1 * intensity
        }),
        MoveWithTime("z")({ frequency: speedUniform, amplitude: 2 * intensity })
      ]),

      diffuseColor: ColorStack(new Color(color), [
        SoftlightBlendNode({
          opacity: 0.8,
          b: MultiplyNode({
            a: new Color(1, 1, 1).multiplyScalar(fresnelIntensity) as Parameter<
              "vec3"
            >,
            b: FresnelNode()
          })
        })
      ])
    })

    return root
  }, [intensity, color, fresnelIntensity])

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
          uniforms={{ ...uniforms, u_speed: { value: speed } }}
          {...restShader}
          ref={material}
        />
      </mesh>
    </group>
  )
}
