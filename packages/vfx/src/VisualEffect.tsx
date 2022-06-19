import { GroupProps } from "@react-three/fiber"
import React from "react"

export type VisualEffectProps = GroupProps

export const VisualEffect = (props: VisualEffectProps) => {
  return <group {...props} />
}
