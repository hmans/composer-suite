import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  ColorNode,
  compileShader,
  ComposeNode,
  Factory,
  float,
  MultiplyNode,
  Parameter,
  PositionNode,
  TimeNode,
  vec3
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const WorldPositionNode = Factory(() => ({
  name: "World Position (?)",
  varyings: {
    v_worldPosition: vec3(
      "vec3(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2])"
    )
  },
  out: {
    value: vec3("v_worldPosition")
  }
}))

const WorldNormalNode = Factory(() => ({
  name: "World Normal (?)",
  varyings: {
    v_worldNormal: vec3(`
      normalize(
        mat3(
          modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz
        ) * normal
      )
    `)
  },
  out: {
    value: vec3("v_worldNormal")
  }
}))

const FresnelNode = Factory(() => ({
  name: "Fresnel",
  in: {
    alpha: float(1),
    bias: float(0),
    intensity: float(1),
    power: float(2),
    factor: float(1),
    worldPosition: vec3(WorldPositionNode()),
    worldNormal: vec3(WorldNormalNode())
  },
  out: {
    value: float()
  },
  fragment: {
    body: `
      float f_a = (in_factor + dot(in_worldPosition, in_worldNormal));
      float f_fresnel = in_bias + in_intensity * pow(abs(f_a), in_power);
      f_fresnel = clamp(f_fresnel, 0.0, 1.0);
      out_value = f_fresnel;
    `
  }
}))

const CSMMasterNode = Factory(() => ({
  name: "CustomShaderMaterial Master",
  in: {
    position: vec3(),
    diffuseColor: vec3(new Color(1, 1, 1))
  },
  vertex: {
    body: `
      csm_Position = in_position;
    `
  },
  fragment: {
    body: `
      csm_DiffuseColor = vec4(in_diffuseColor, 1.0);
    `
  }
}))

const WobbleNode = Factory(() => ({
  name: "Wobble",

  in: {
    /** The time offset */
    time: float(),

    /** How fast to wobble */
    frequency: float(1),

    /** How hard to wobble */
    amplitude: float(1)
  },

  out: {
    /** The wobble value */
    value: float("sin(in_time * in_frequency) * in_amplitude")
  }
}))

type WobbleProps = {
  frequency?: number
  amplitude?: number
  time?: Parameter<"float">
}

const WobbleAnimation = ({
  frequency = 1,
  amplitude = 1,
  time = TimeNode()
}: WobbleProps) =>
  ComposeNode({
    x: WobbleNode({ time, frequency: 8 * frequency, amplitude }),
    y: WobbleNode({ time, frequency: 5 * frequency, amplitude }),
    z: WobbleNode({ time, frequency: 3 * frequency, amplitude })
  }).out.vec3

function useShader() {
  return useMemo(() => {
    const time = TimeNode()

    const root = CSMMasterNode({
      position: AddNode({
        a: PositionNode(),
        b: WobbleAnimation({ frequency: 2, amplitude: 3, time })
      }),

      diffuseColor: MultiplyNode({
        a: ColorNode({ value: new Color("hotpink") }),
        b: FresnelNode()
      })
    })

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const [shaderProps, update] = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  useFrame((_, dt) => update(dt))

  return <CustomShaderMaterial {...props} {...shaderProps} ref={material} />
}

export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <MyMaterial baseMaterial={MeshStandardMaterial}></MyMaterial>
      </mesh>
    </group>
  )
}
