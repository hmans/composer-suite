import { GroupProps } from "@react-three/fiber"
import React from "react"

export type VisualEffectProps = GroupProps

export const VisualEffect: React.FC<VisualEffectProps> = (props) => {
  return <group {...props} />
}
