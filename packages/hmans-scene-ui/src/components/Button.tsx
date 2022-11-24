import { GroupProps } from "@react-three/fiber"
import React from "react"
import { MouseCursor } from "./MouseCursor"
import { Text } from "./Text"

export const Button = ({
  label,
  ...props
}: {
  label: string
} & GroupProps) => {
  return (
    <MouseCursor {...props}>
      <mesh>
        <planeGeometry args={[4, 1]} />
        <meshBasicMaterial color="#444" />
      </mesh>

      <Text
        maxWidth={8}
        fontSize={0.5}
        textAlign="center"
        depthOffset={-1}
        text="Click Me"
      />
    </MouseCursor>
  )
}
