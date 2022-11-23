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
  pivot?: [number, number]
  anchor?: [number, number, number, number]
  offset?: [number, number, number, number]
  debug?: boolean
}

export const Rect = ({
  anchor = [0, 0, 1, 1],
  offset = [0, 0, 0, 0],
  pivot = [0, 0],
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

  const [offsetLeft, offsetTop, offsetRight, offsetBottom] = offset
  const [anchorLeft, anchorTop, anchorRight, anchorBottom] = anchor

  const anchorLeftPosition = (anchorLeft - 0.5) * parent.width
  const anchorRightPosition = (anchorRight - 0.5) * parent.width
  const anchorTopPosition = (0.5 - anchorTop) * parent.height
  const anchorBottomPosition = (0.5 - anchorBottom) * parent.height

  const leftPosition = anchorLeftPosition + offsetLeft
  const rightPosition = anchorRightPosition + offsetRight
  const topPosition = anchorTopPosition - offsetTop
  const bottomPosition = anchorBottomPosition - offsetBottom

  const width = rightPosition - leftPosition
  const height = topPosition - bottomPosition

  return (
    <group {...props}>
      {/* Apply pivot offset */}
      <group position={[0, 0, 0]}>
        {debug && (
          <group position={[0, 0, 0]}>
            <OriginMarker color={colors[debugColorIndex]} />

            <mesh
              position={[anchorLeftPosition, anchorTopPosition, 0]}
              rotation-z={Math.PI * 1.25}
            >
              <coneGeometry args={[0.05, 0.1]} />
              <meshBasicMaterial color={colors[debugColorIndex]} />
            </mesh>

            <mesh
              position={[anchorRightPosition, anchorTopPosition, 0]}
              rotation-z={-Math.PI * 1.25}
            >
              <coneGeometry args={[0.05, 0.1]} />
              <meshBasicMaterial color={colors[debugColorIndex]} />
            </mesh>

            <mesh
              position={[anchorLeftPosition, anchorBottomPosition, 0]}
              rotation-z={-Math.PI * 0.25}
            >
              <coneGeometry args={[0.05, 0.1]} />
              <meshBasicMaterial color={colors[debugColorIndex]} />
            </mesh>

            <mesh
              position={[anchorRightPosition, anchorBottomPosition, 0]}
              rotation-z={Math.PI * 0.25}
            >
              <coneGeometry args={[0.05, 0.1]} />
              <meshBasicMaterial color={colors[debugColorIndex]} />
            </mesh>
          </group>
        )}

        {/* Apply pivot */}
        <group
          position={[
            (parent.width * (anchorLeft - (1 - anchorRight)) +
              offsetLeft +
              offsetRight) /
              2,
            (parent.height * anchorTop + offsetBottom + offsetTop) / -2,
            0
          ]}
        >
          {/* Debug View */}
          {debug && (
            <>
              {/* Visualize the canvas */}
              <mesh scale={[width, height, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial color={colors[debugColorIndex]} wireframe />
              </mesh>
            </>
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
    <sphereGeometry args={[0.05]} />
    <meshBasicMaterial color={"white"} depthTest={false} />
  </mesh>
)
