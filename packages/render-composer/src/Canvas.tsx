import * as R3F from "@react-three/fiber"
import React from "react"

export type CanvasProps = R3F.Props

export const Canvas = (props: CanvasProps) => (
  <R3F.Canvas
    shadows
    flat
    gl={{
      powerPreference: "high-performance",
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false
    }}
    {...props}
  />
)
