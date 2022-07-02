import { Factory, float, ValueType, variable, vec3 } from "../shadenfreude"

export const UniformNode = Factory<{ name: string; type: ValueType }>(
  ({ name, type }) => ({
    name: "Uniform",
    uniforms: {
      [name]: variable(type)
    },
    out: {
      value: variable(type, name)
    }
  })
)

export const TimeNode = Factory(() => ({
  name: "Time",

  uniforms: {
    u_time: float()
  },

  out: {
    /** The absolute time, in seconds */
    value: float("u_time"),

    /** Sine of the times */
    sin: float("sin(u_time)"),

    /** Cosine of the times */
    cos: float("cos(u_time)")
  }
}))

export const ViewDirectionNode = Factory(() => ({
  name: "View Direction",
  varyings: {
    v_viewDirection: vec3(
      "vec3(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2])"
    )
  },
  out: {
    value: vec3("v_viewDirection")
  }
}))
