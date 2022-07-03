import { Vector3, Vector4 } from "three"
import {
  Factory,
  float,
  getValueType,
  Parameter,
  Program,
  ShaderNode,
  uniqueGlobalIdentifier,
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
  inputs: {
    x: float(),
    y: float(),
    z: float(),
    w: float()
  },
  outputs: {
    value: vec4("vec4(inputs.x, inputs.y, inputs.z, inputs.w)"),
    vector4: vec4("vec4(inputs.x, inputs.y, inputs.z, inputs.w)"),
    vector3: vec3("vec3(inputs.x, inputs.y, inputs.z)"),
    vector2: vec2("vec2(inputs.x, inputs.y)")
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
    inputs: {
      a: variable(aType, props.a)
    },
    outputs: {
      value: variable(aType, `${fun}(inputs.a)`)
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
    inputs: {
      a: variable(aType, props.a),
      b: variable(bType, props.b)
    },
    outputs: {
      value: variable(aType, `inputs.a ${operator} inputs.b`)
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
    inputs: {
      a: variable<T>(type, props.a),
      b: variable<T>(type, props.b),
      factor: float(props.factor || 0.5)
    },
    outputs: {
      value: variable<T>(type, "mix(inputs.a, inputs.b, inputs.factor)")
    }
  })
}

type BlendProps<T extends BlendableType> = {
  type: T
  a?: Parameter<T>
  b?: Parameter<T>
  opacity?: Parameter<"float">
  mode?: BlendMode
}

type BlendableType = "float" | "vec3" | "vec4"

type BlendMode = "add" | "multiply"

type BlendFunctions = {
  [M in BlendMode]: {
    [T in BlendableType]: string
  }
}

export const BlendNode = <T extends BlendableType>({
  type,
  a,
  b,
  opacity = 1,
  mode = "add"
}: BlendProps<T>) => {
  const defaults: { [M in BlendMode]: string } = {
    add: "min(inputs.a + inputs.b, 1.0)",
    multiply: "min(inputs.a * inputs.b, 1.0)"
  }

  const bagOfChunks: BlendFunctions = {
    add: {
      float: defaults.add,
      vec3: defaults.add
    },
    multiply: {
      float: defaults.multiply,
      vec3: defaults.multiply
    }
  }

  const body = [
    `${type} blended = ${bagOfChunks[mode][type]};`,
    `outputs.value = mix(inputs.a, blended, inputs.opacity);`,
    type === "vec4" && `outputs.value.a = inputs.a.a;`
  ]

  return ShaderNode({
    name: "Blend",
    inputs: {
      a: variable(type, a),
      b: variable(type, b),
      opacity: float(opacity)
    },
    outputs: {
      value: variable(type)
    },
    vertex: { body },
    fragment: { body }
  })
}

const blend = BlendNode({ type: "vec3" })

export const SoftlightBlendNode = Factory(() => {
  const blendSoftlight = uniqueGlobalIdentifier("blend_softlight")

  const program: Program = {
    header: `
      float ${blendSoftlight}(const in float x, const in float y)
      {
        return (y < 0.5) ?
          (2.0 * x * y + x * x * (1.0 - 2.0 * y)) :
          (sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));
      }
    `,

    body: `
      vec3 z = vec3(
        ${blendSoftlight}(inputs.a.r, inputs.b.r),
        ${blendSoftlight}(inputs.a.g, inputs.b.g),
        ${blendSoftlight}(inputs.a.b, inputs.b.b)
      );

      outputs.value = mix(inputs.a, z, inputs.opacity);
    `
  }

  return {
    name: "Softlight Blend",
    inputs: {
      a: vec3(),
      b: vec3(),
      opacity: float(1)
    },
    outputs: {
      value: vec3()
    },
    vertex: program,
    fragment: program
  }
})

export const FresnelNode = Factory(() => ({
  name: "Fresnel",
  inputs: {
    alpha: float(1),
    bias: float(0),
    intensity: float(1),
    power: float(2),
    factor: float(1),
    viewDirection: vec3(ViewDirectionNode()),
    worldNormal: vec3(VertexNormalNode().outputs.worldSpace)
  },
  outputs: {
    value: float()
  },
  fragment: {
    body: `
        float f_a = (inputs.factor + dot(inputs.viewDirection, inputs.worldNormal));
        float f_fresnel = inputs.bias + inputs.intensity * pow(abs(f_a), inputs.power);
        f_fresnel = clamp(f_fresnel, 0.0, 1.0);
        outputs.value = f_fresnel;
      `
  }
}))
