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
  width?: number
  height?: number
  anchor?: [number, number, number, number]
  offset?: [number, number, number, number]
  debug?: boolean
}

export const Rect = ({
  anchor = [0, 0, 1, 1],
  offset = [0, 0, 0, 0],
  width: _width,
  height: _height,
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

  const [offsetLeft, offsetBottom, offsetRight, offsetTop] = offset

  const width =
    _width !== undefined
      ? _width
      : parent
      ? parent.width - (offsetLeft + offsetRight)
      : 1

  const height =
    _height !== undefined
      ? _height
      : parent
      ? parent.height - (offsetTop + offsetBottom)
      : 1

  return (
    <group {...props}>
      {/* Apply anchor offset */}
      <group
        position={[
          (offsetLeft - offsetRight) / 2,
          (offsetTop - offsetBottom) / 2,
          0
        ]}
      >
        {debug && <OriginMarker color={colors[debugColorIndex]} />}

        {/* Apply pivot */}
        <group position={[0, 0, 0]}>
          {/* Visualize the canvas */}
          {debug && (
            <mesh scale={[width, height, 1]}>
              <planeGeometry args={[1, 1, width, height]} />
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
