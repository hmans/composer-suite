import {
  Factory,
  float,
  getValueType,
  Parameter,
  ShaderNode,
  ValueType,
  variable,
  vec2,
  vec3,
  vec4
} from "../shadenfreude"
import { GeometryNormalNode } from "./geometry"
import { ViewDirectionNode } from "./inputs"

export const ComposeNode = Factory(() => ({
  name: "Compose components",
  in: {
    x: float(),
    y: float(),
    z: float(),
    w: float()
  },
  out: {
    value: vec4("vec4(in_x, in_y, in_z, in_w)"),
    vec4: vec4("vec4(in_x, in_y, in_z, in_w)"),
    vec3: vec3("vec3(in_x, in_y, in_z)"),
    vec2: vec2("vec2(in_x, in_y)")
  }
}))

type FunctionProps<A extends ValueType> = {
  a: Parameter<A>
}

const FunctionNode = (fun: string) => <A extends ValueType>(
  props: FunctionProps<A>
) => {
  const aType = getValueType(props.a)

  return ShaderNode({
    name: `Perform ${fun} on ${aType}`,
    in: {
      a: variable(aType, props.a)
    },
    out: {
      value: variable(aType, `${fun}(in_a)`)
    }
  })
}

export const SinNode = FunctionNode("sin")
export const CosNode = FunctionNode("cos")

type Operator = "+" | "-" | "*" | "/"

type OperatorProps<A extends ValueType, B extends ValueType> = {
  a: Parameter<A>
  b: Parameter<B>
}

const OperatorNode = (operator: Operator) => <
  A extends ValueType,
  B extends ValueType
>(
  props: OperatorProps<A, B>
) => {
  const aType = getValueType(props.a)
  const bType = getValueType(props.b)

  return ShaderNode({
    name: `Perform ${aType} ${operator} ${bType}`,
    in: {
      a: variable(aType, props.a),
      b: variable(bType, props.b)
    },
    out: {
      value: variable(aType, `in_a ${operator} in_b`)
    }
  })
}

export const AddNode = OperatorNode("+")
export const SubtractNode = OperatorNode("-")
export const MultiplyNode = OperatorNode("*")
export const DivideNode = OperatorNode("/")

export const MixNode = <T extends ValueType>(type: T) =>
  Factory(() =>
    ShaderNode({
      name: "Mix a and b values",
      in: {
        a: variable(type),
        b: variable(type),
        amount: float(0.5)
      },
      out: {
        value: variable(type, "in_b * in_amount + in_a * (1.0 - in_amount)")
      }
    })
  )

export const ParameterizedMixNode = Factory<{ type: ValueType }>(({ type }) =>
  ShaderNode({
    name: "Mix a and b values",
    in: {
      a: variable(type),
      b: variable(type),
      amount: float(0.5)
    },
    out: {
      value: variable(type, "in_b * in_amount + in_a * (1.0 - in_amount)")
    }
  })
)

export const FresnelNode = Factory(() => ({
  name: "Fresnel",
  in: {
    alpha: float(1),
    bias: float(0),
    intensity: float(1),
    power: float(2),
    factor: float(1),
    viewDirection: vec3(ViewDirectionNode()),
    worldNormal: vec3(GeometryNormalNode().out.worldSpace)
  },
  out: {
    value: float()
  },
  fragment: {
    body: `
        float f_a = (in_factor + dot(in_viewDirection, in_worldNormal));
        float f_fresnel = in_bias + in_intensity * pow(abs(f_a), in_power);
        f_fresnel = clamp(f_fresnel, 0.0, 1.0);
        out_value = f_fresnel;
      `
  }
}))
