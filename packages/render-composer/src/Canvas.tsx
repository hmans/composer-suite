import * as R3F from "@react-three/fiber"
import React, { StrictMode } from "react"

export type CanvasProps = R3F.Props & {
  /** When true, enables React's StrictMode. */
  strict?: boolean
}

export const Canvas = ({ strict = false, children, ...props }: CanvasProps) => (
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
    children={strict ? <StrictMode>{children}</StrictMode> : children}
    {...props}
  />
)
