import { GroupProps } from "@react-three/fiber"
import React, { createContext, useContext } from "react"
import { ColorRepresentation } from "three"

const colors = ["#69d2e7", "#fa6900", "#e0e4cc", "#a7dbd8", "#f38630"]

export const RectContext = createContext<{
  width: number
  height: number
  debug: boolean
  debugColorIndex: number
}>(null!)

export type RectProps = GroupProps & {
  anchorX?: number
  anchorY?: number
  pivotX?: number
  pivotY?: number
  width: number | `${number}%`
  height: number | `${number}%`
  debug?: boolean
}

export const Rect = ({
  anchorX = 0.5,
  anchorY = 0.5,
  pivotX = 0.5,
  pivotY = 0.5,
  width: _width,
  height,
  children,
  debug: _debug,
  ...props
}: RectProps) => {
  const parent = useContext(RectContext)
  const debug = _debug ?? parent?.debug ?? false

  const debugColorIndex =
    parent?.debugColorIndex !== undefined
      ? (parent?.debugColorIndex + 1) % colors.length
      : 0

  /* Calculate width */
  const width =
    typeof _width === "string"
      ? (+_width.slice(0, -1) / 100) * parent?.width || 0
      : _width

  return (
    <group {...props}>
      {/* Apply anchor offset */}
      <group
        position={[
          parent ? parent.width * (anchorX - 0.5) : 0,
          parent ? parent.height * (anchorY - 0.5) : 0,
          0
        ]}
      >
        {debug && <OriginMarker color={colors[debugColorIndex]} />}

        {/* Apply pivot */}
        <group
          position={[-(pivotX - 0.5) * width, -(pivotY - 0.5) * height, 0]}
        >
          {/* Visualize the canvas */}
          {debug && (
            <mesh scale={[width, height, 1]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial color={colors[debugColorIndex]} wireframe />
            </mesh>
          )}

          <RectContext.Provider
            value={{ width, height, debug, debugColorIndex }}
          >
            <group position-z={0.01}>{children}</group>
          </RectContext.Provider>
        </group>
      </group>
    </group>
  )
}

const OriginMarker = ({ color = "red" }: { color?: ColorRepresentation }) => (
  <mesh>
    <sphereGeometry args={[0.1]} />
    <meshBasicMaterial color={color} depthTest={false} />
  </mesh>
)

export const Anchor = {
  TopLeft: {
    anchorX: 0,
    pivotX: 0,
    anchorY: 1,
    pivotY: 1
  },
  BottomRight: {
    anchorX: 1,
    pivotX: 1,
    anchorY: 0,
    pivotY: 0
  },
  Left: {
    anchorX: 0,
    pivotX: 0
  },
  Center: {
    anchorX: 0.5,
    pivotX: 0.5
  },
  Right: {
    anchorX: 1,
    pivotX: 1
  },
  Top: {
    anchorY: 1,
    pivotY: 1
  },
  Middle: {
    anchorY: 0.5,
    pivotY: 0.5
  },
  Bottom: {
    anchorY: 0,
    pivotY: 0
  }
}
