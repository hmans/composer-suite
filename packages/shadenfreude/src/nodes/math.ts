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
import { VertexNormalNode } from "./geometry"
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

export type FunctionNodeProps<A extends ValueType> = {
  a: Parameter<A>
}

const FunctionNode = (fun: string) => <A extends ValueType>(
  props: FunctionNodeProps<A>
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

export type OperatorNodeProps<A extends ValueType, B extends ValueType> = {
  a: Parameter<A>
  b: Parameter<B>
}

const OperatorNode = (operator: Operator) => <
  A extends ValueType,
  B extends ValueType
>(
  props: OperatorNodeProps<A, B>
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

export type MixNodeProps<T extends ValueType> = {
  a?: Parameter
  b: Parameter<T>
  factor?: Parameter<"float">
}

export const MixNode = <T extends ValueType>(props: MixNodeProps<T>) => {
  const type = getValueType(props.b)

  return ShaderNode({
    name: `Mix a and b values (${type})`,
    in: {
      a: variable<T>(type, props.a),
      b: variable<T>(type, props.b),
      factor: float(props.factor || 0.5)
    },
    out: {
      value: variable<T>(type, "mix(in_a, in_b, in_factor)")
    }
  })
}

export const FresnelNode = Factory(() => ({
  name: "Fresnel",
  in: {
    alpha: float(1),
    bias: float(0),
    intensity: float(1),
    power: float(2),
    factor: float(1),
    viewDirection: vec3(ViewDirectionNode()),
    worldNormal: vec3(VertexNormalNode().out.worldSpace)
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
