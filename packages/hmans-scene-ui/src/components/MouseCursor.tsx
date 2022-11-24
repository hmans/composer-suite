import { GroupProps } from "@react-three/fiber"
import React, { useEffect, useState } from "react"

type MouseCursorProps = GroupProps & { active?: string; inactive?: string }

export const MouseCursor = ({
  active = "pointer",
  inactive = "auto",
  ...props
}: MouseCursorProps) => {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto"
  }, [hovered])

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}
    />
  )
}
