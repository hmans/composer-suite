import {
  Factory,
  float,
  getValueType,
  inferVariable,
  Parameter,
  ShaderNode,
  ValueType,
  variable,
  Variable,
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

function makeFunctionNode(fun: string) {
  return function<T extends ValueType>({ a }: OperatorProps<T>) {
    return ShaderNode({
      name: `${fun} Function`,
      in: { a: inferVariable(a) },
      out: {
        value: {
          ...inferVariable(a),
          value: `${fun}(in_a)`
        } as Variable<T>
      }
    })
  }
}

export const SinNode = makeFunctionNode("sin")
export const CosNode = makeFunctionNode("cos")

type Operator = "+" | "-" | "*" | "/"

type OperatorProps<T extends ValueType> = {
  a: Parameter<T>
  b: Parameter<any>
}

export const OperatorNode = <T extends ValueType>({
  a,
  b,
  operator
}: OperatorProps<T> & { operator: Operator }) =>
  ShaderNode({
    name: `Perform ${operator} on ${getValueType(a)}`,
    in: {
      a: inferVariable(a),
      b: inferVariable(b)
    },
    out: {
      value: {
        ...inferVariable(a),
        value: `in_a ${operator} in_b`
      } as Variable<T>
    }
  })

export const AddNode = <T extends ValueType>({ a, b }: OperatorProps<T>) =>
  OperatorNode({ operator: "+", a, b })

export const SubtractNode = <T extends ValueType>({ a, b }: OperatorProps<T>) =>
  OperatorNode({ operator: "-", a, b })

export const DivideNode = <T extends ValueType>({ a, b }: OperatorProps<T>) =>
  OperatorNode({ operator: "/", a, b })

export const MultiplyNode = <T extends ValueType>({ a, b }: OperatorProps<T>) =>
  OperatorNode({ operator: "*", a, b })

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
