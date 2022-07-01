import { Factory, float, vec3 } from "../shadenfreude"

export const PositionNode = Factory(() => ({
  name: "Position",
  varyings: {
    v_position: vec3("position")
  },
  out: {
    value: vec3("v_position")
  }
}))

export const TimeNode = Factory(() => ({
  name: "Time",

  out: {
    /** The absolute time, in seconds */
    value: float("u_time"),

    /** Sine of the times */
    sin: float("sin(u_time)"),

    /** Cosine of the times */
    cos: float("cos(u_time)")
  },

  vertex: {
    header: "uniform float u_time;"
  },

  fragment: {
    header: "uniform float u_time;"
  }
}))
