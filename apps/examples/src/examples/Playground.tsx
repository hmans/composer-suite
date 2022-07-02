import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  ColorNode,
  compileShader,
  ComposeNode,
  Factory,
  float,
  GeometryNormalNode,
  GeometryPositionNode,
  GeometryUVNode,
  MultiplyNode,
  Parameter,
  Program,
  ShaderMaterialMasterNode,
  TimeNode,
  vec2,
  vec3
} from "shadenfreude"
import { Color, ShaderMaterial } from "three"

const ViewDirectionNode = Factory(() => ({
  name: "View Direction (World Space)",
  varyings: {
    v_worldPosition: vec3(
      "vec3(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2])"
    )
  },
  out: {
    value: vec3("v_worldPosition")
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
    worldPosition: vec3(ViewDirectionNode()),
    worldNormal: vec3(GeometryNormalNode().out.worldSpace)
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

export const BlendNode = Factory(() => {
  const program: Program = {
    header: `
      float blend_softlight(const in float x, const in float y) {
        return (y < 0.5) ?
          (2.0 * x * y + x * x * (1.0 - 2.0 * y)) :
          (sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));
      }
    `,
    body: `
      vec3 z = vec3(
        blend_softlight(in_a.r, in_b.r),
        blend_softlight(in_a.g, in_b.g),
        blend_softlight(in_a.b, in_b.b)
      );
      out_value = vec3(z.xyz * in_opacity + in_a.xyz * (1.0 - in_opacity));
      out_value = z.xyz * in_opacity;
    `
  }

  return {
    name: "Softlight Blend",
    in: {
      a: vec3(),
      b: vec3(),
      opacity: float(1)
    },
    out: {
      value: vec3()
    },
    vertex: program,
    fragment: program
  }
})

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

const Squeezed = Factory(() => ({
  in: {
    position: vec3(),
    time: float(),
    uv: vec2(GeometryUVNode())
  },
  out: {
    value: vec3(
      `vec3(
        in_position.x * (1.0 + sin(in_time * 2.0 + in_uv.y * 13.0) * 0.3),
        in_position.y * (1.0 + cos(in_time * 2.3 + in_uv.y * 11.0) * 0.2),
        in_position.z * (1.0 + sin(in_time * 2.0 + in_uv.y * 13.0) * 0.1))`
    )
  }
}))

function useShader() {
  return useMemo(() => {
    const time = TimeNode()

    const fresnel = MultiplyNode({
      a: ColorNode({ value: new Color("white") }),
      b: FresnelNode({ power: 2, factor: 1, bias: 0, intensity: 2 })
    })

    const root = ShaderMaterialMasterNode({
      position: AddNode({
        a: Squeezed({ position: GeometryPositionNode(), time }),
        b: WobbleAnimation({ frequency: 0.2, amplitude: 3.5, time })
      }),

      color: BlendNode({
        a: ColorNode({ value: new Color("#c42") }),
        b: fresnel
      })
    })

    return compileShader(root)
  }, [])
}

export default function Playground() {
  const [shaderProps, update] = useShader()
  const material = useRef<ShaderMaterial>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  useFrame((_, dt) => update(dt))

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <shaderMaterial ref={material} {...shaderProps} />

        {/* <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
          ref={material}
        /> */}
      </mesh>
    </group>
  )
}
