import { Factory, float } from "../shadenfreude"

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
