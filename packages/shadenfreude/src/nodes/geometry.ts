import { Factory, vec2, vec3 } from "../shadenfreude"

export const GeometryPositionNode = Factory(() => ({
  name: "Position",
  varyings: {
    v_position: vec3("position")
  },
  out: {
    value: vec3("v_position")
  }
}))

export const GeometryNormalNode = Factory(() => ({
  name: "Normal",
  varyings: {
    v_localSpace: vec3("normal"),
    v_WorldSpace: vec3(
      "normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal)"
    )
  },
  out: {
    value: vec3("v_localSpace"),
    worldSpace: vec3("v_WorldSpace")
  }
}))

export const GeometryUVNode = Factory(() => ({
  name: "UV",
  varyings: {
    v_uv: vec2("uv")
  },
  out: {
    value: vec2("v_uv")
  }
}))
