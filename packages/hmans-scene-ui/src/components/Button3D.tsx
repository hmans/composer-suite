import { GroupProps } from "@react-three/fiber"
import React from "react"
import { Text } from "./Text"
import { MouseCursor } from "."

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
        <meshStandardMaterial color="red" metalness={0.5} roughness={0.5} />
      </mesh>
      <Text
        maxWidth={8}
        fontSize={0.5}
        textAlign="center"
        position-z={0.25001}
        text="Click Me"
      />
    </MouseCursor>
  )
}
