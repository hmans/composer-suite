import { lines } from "../lib/concatenator3000"
import {
  Chunk,
  Factory,
  float,
  getValueType,
  IShaderNodeWithDefaultOutput,
  Parameter,
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
>({
  a,
  b
}: OperatorNodeProps<A, B>) => {
  const aType = getValueType(a)
  const bType = getValueType(b)

  return ShaderNode({
    name: `Perform ${aType} ${operator} ${bType}`,
    inputs: {
      a: variable(aType, a),
      b: variable(bType, b)
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

export const addNodes = <T extends ValueType>(
  ...[first, ...rest]: Parameter[]
): IShaderNodeWithDefaultOutput<T> =>
  AddNode({ a: first, b: rest.length > 1 ? addNodes(...rest) : rest[0] })

export const multiplyNodes = <T extends ValueType>(
  ...[first, ...rest]: Parameter[]
): IShaderNodeWithDefaultOutput<T> =>
  MultiplyNode({
    a: first,
    b: rest.length > 1 ? multiplyNodes(...rest) : rest[0]
  })

export const divideNodes = <T extends ValueType>(
  ...[first, ...rest]: Parameter[]
): IShaderNodeWithDefaultOutput<T> =>
  DivideNode({ a: first, b: rest.length > 1 ? divideNodes(...rest) : rest[0] })

export const subtractNodes = <T extends ValueType>(
  ...[first, ...rest]: Parameter[]
): IShaderNodeWithDefaultOutput<T> =>
  SubtractNode({
    a: first,
    b: rest.length > 1 ? subtractNodes(...rest) : rest[0]
  })

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
  a: Parameter<T>
  b?: Parameter<T>
  opacity?: Parameter<"float">
  mode?: BlendMode
}

type BlendableType = "float" | "vec3" | "vec4"

type BlendMode = "add" | "average" | "multiply" | "normal" | "softlight"

type BlendFunctions = {
  [M in BlendMode]?: {
    [T in BlendableType]?: string
  }
}

export const BlendNode = <T extends BlendableType>({
  a,
  b,
  opacity = 1,
  mode = "normal"
}: BlendProps<T>) => {
  const t = getValueType(a) || (b && getValueType(b))

  const functions: { [M in BlendMode]?: string } = {
    softlight: uniqueGlobalIdentifier()
  }

  const headerChunks: { [M in BlendMode]?: Chunk } = {
    softlight: [
      `
      float ${functions.softlight}(float base, float blend) {
        return (blend < 0.5)
          ?  2.0 * base * blend  +  base * base * (1.0 - 2.0 * blend)
          :  sqrt(base) * (2.0 * blend - 1.0)  +  2.0 * base * (1.0 - blend);
      }

      vec3 ${functions.softlight}(vec3 base, vec3 blend) {
        return vec3(
          ${functions.softlight}(base.r, blend.r),
          ${functions.softlight}(base.g, blend.g),
          ${functions.softlight}(base.b,blend.b)
        );
      }
      `
    ]
  }

  const blendFunctionDefaults: { [M in BlendMode]: Chunk } = {
    add: "min(inputs.a + inputs.b, 1.0)",
    average: "(inputs.a + inputs.b) / 2.0",
    multiply: "min(inputs.a * inputs.b, 1.0)",
    normal: "inputs.b",
    softlight: `${functions.softlight}(inputs.a, inputs.b)`
  }

  const blendFunctionOverrides: BlendFunctions = {}

  /* Header */
  const header = lines(headerChunks[mode])

  /* Body */
  const body = lines(
    /* Run the blend function */
    `${t} blended = ${blendFunctionOverrides[mode]?.[t] ||
      blendFunctionDefaults[mode]};`,

    /* Apply the opacity */
    `outputs.value = mix(inputs.a, blended, inputs.opacity);`,

    /* If we're dealing with vec4, set the original alpha value */
    t === "vec4" && `outputs.value.a = inputs.a.a;`
  )

  return ShaderNode({
    name: "Blend",
    inputs: {
      a: variable(t, a),
      b: variable(t, b),
      opacity: float(opacity)
    },
    outputs: {
      value: variable(t)
    },
    vertex: { header, body },
    fragment: { header, body }
  })
}

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
