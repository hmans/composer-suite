import {
  Factory,
  float,
  ShaderNode,
  ValueType,
  Variable,
  variable,
  vec2,
  vec3
} from "../shadenfreude"

export const UniformNode = <T extends ValueType>({
  name,
  type
}: {
  name: string
  type: T
}) =>
  ShaderNode({
    name: `Uniform ${name}`,
    uniforms: {
      [name]: variable(type) as Variable<T>
    },
    outputs: {
      value: variable(type, name)
    }
  })

export const AttributeNode = <T extends ValueType>({
  name,
  type
}: {
  name: string
  type: T
}) =>
  ShaderNode({
    name: `Attribute ${name}`,
    varyings: {
      v_value: variable(type, name)
    },
    outputs: {
      value: variable(type, "v_value")
    },
    vertex: {
      header: `
      #ifndef ${name}_attribute
        #define ${name}_attribute;
        attribute ${type} ${name};
      #endif
      `
    }
  })

export const TimeNode = Factory(() => ({
  name: "Time",

  uniforms: {
    u_time: float()
  },

  outputs: {
    /** The absolute time, in seconds */
    value: float("u_time"),

    /** Sine of the times */
    sin: float("sin(u_time)"),

    /** Cosine of the times */
    cos: float("cos(u_time)")
  }
}))

export const ResolutionNode = Factory(() => ({
  name: "Resolution",

  uniforms: {
    u_resolution: vec2()
  },

  outputs: {
    value: vec2("u_resolution")
  }
}))

export const ViewDirectionNode = Factory(() => ({
  name: "View Direction",
  varyings: {
    v_viewDirection: vec3(
      "vec3(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2])"
    )
  },
  outputs: {
    value: vec3("v_viewDirection")
  }
}))
