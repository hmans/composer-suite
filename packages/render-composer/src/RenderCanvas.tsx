import { Canvas, Props } from "@react-three/fiber"
import React from "react"

export type RenderCanvasProps = Props

export const RenderCanvas = (props: RenderCanvasProps) => (
  <Canvas
    shadows
    flat
    gl={{
      powerPreference: "high-performance",
      alpha: false,
      depth: true,
      stencil: false,
      antialias: false
    }}
    {...props}
  />
)
