import { Factory, vec3 } from "../shadenfreude"

export const PositionNode = Factory(() => ({
  name: "Position",
  varyings: {
    v_position: vec3("position")
  },
  out: {
    value: vec3("v_position")
  }
}))
