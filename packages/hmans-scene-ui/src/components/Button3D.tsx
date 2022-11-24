import { GroupProps } from "@react-three/fiber"
import React from "react"
import { MouseCursor } from "./MouseCursor"
import { Text } from "./Text"

export const Button3D = ({
  label,
  ...props
}: {
  label: string
} & GroupProps) => {
  return (
    <MouseCursor position-z={0.25} {...props}>
      <mesh>
        <boxGeometry args={[4, 1, 0.5]} />
        <meshBasicMaterial color="#444" />
      </mesh>
      <Text
        maxWidth={8}
        fontSize={0.5}
        textAlign="center"
        position-z={0.25}
        depthOffset={-0.001}
        text="Click Me"
      />
    </MouseCursor>
  )
}
