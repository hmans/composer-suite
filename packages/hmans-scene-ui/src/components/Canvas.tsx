import { GroupProps } from "@react-three/fiber"
import React, { forwardRef } from "react"
import { Group } from "three"
import { RectContext } from "./Rect"

export type CanvasProps = GroupProps & {
  width: number
  height: number
  debug?: boolean
}

export const Canvas = forwardRef<Group, CanvasProps>(
  ({ children, width, height, debug = false, ...props }, ref) => {
    return (
      <RectContext.Provider
        value={{ width, height, debug, debugColorIndex: 0 }}
      >
        {debug && (
          <mesh scale={[width, height, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="white" wireframe />
          </mesh>
        )}

        <group {...props}>{children}</group>
      </RectContext.Provider>
    )
  }
)
