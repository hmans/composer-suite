import { GroupProps } from "@react-three/fiber"
import { ColorRepresentation } from "three"
import React from "react"

export type FlatStageProps = GroupProps & { color?: ColorRepresentation }

export const FlatStage = ({ children, color = "#555", ...props }: FlatStageProps) => (
  <group position-y={-1.5} {...props}>
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color={color} />
    </mesh>

    {children}
  </group>
)
