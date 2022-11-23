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
  margin?: [number, number, number, number]
  debug?: boolean
}

const ANCHOR_GIZMO_OFFSET = 0.035
const DEPTH_OFFSET = 0.001

export const Rect = ({
  anchor = [0, 0, 1, 1],
  margin = [0, 0, 0, 0],
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

  const [marginTop, marginRight, marginBottom, marginLeft] = margin
  const [anchorTop, anchorRight, anchorBottom, anchorLeft] = anchor

  const anchorLeftPosition = (anchorLeft - 0.5) * parent.width
  const anchorRightPosition = (1 - anchorRight - 0.5) * parent.width
  const anchorTopPosition = (0.5 - anchorTop) * parent.height
  const anchorBottomPosition = (0.5 - (1 - anchorBottom)) * parent.height

  const leftPosition = anchorLeftPosition + marginLeft
  const rightPosition = anchorRightPosition - marginRight
  const topPosition = anchorTopPosition - marginTop
  const bottomPosition = anchorBottomPosition + marginBottom

  const width = rightPosition - leftPosition
  const height = topPosition - bottomPosition

  return (
    <group {...props}>
      {/* Debug Gizmos */}
      {debug && (
        <group>
          <OriginMarker color={colors[debugColorIndex]} />

          <mesh
            position={[
              anchorLeftPosition - ANCHOR_GIZMO_OFFSET,
              anchorTopPosition + ANCHOR_GIZMO_OFFSET,
              0
            ]}
            rotation-z={Math.PI * 1.25}
          >
            <coneGeometry args={[0.05, 0.1]} />
            <meshBasicMaterial color={colors[debugColorIndex]} />
          </mesh>

          <mesh
            position={[
              anchorRightPosition + ANCHOR_GIZMO_OFFSET,
              anchorTopPosition + ANCHOR_GIZMO_OFFSET,
              0
            ]}
            rotation-z={-Math.PI * 1.25}
          >
            <coneGeometry args={[0.05, 0.1]} />
            <meshBasicMaterial color={colors[debugColorIndex]} />
          </mesh>

          <mesh
            position={[
              anchorLeftPosition - ANCHOR_GIZMO_OFFSET,
              anchorBottomPosition - ANCHOR_GIZMO_OFFSET,
              0
            ]}
            rotation-z={-Math.PI * 0.25}
          >
            <coneGeometry args={[0.05, 0.1]} />
            <meshBasicMaterial color={colors[debugColorIndex]} />
          </mesh>

          <mesh
            position={[
              anchorRightPosition + ANCHOR_GIZMO_OFFSET,
              anchorBottomPosition - ANCHOR_GIZMO_OFFSET,
              0
            ]}
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
          (parent.width * (anchorLeft - anchorRight) +
            marginLeft -
            marginRight) /
            2,

          (parent.height * (anchorTop - anchorBottom) +
            marginTop -
            marginBottom) /
            -2,

          DEPTH_OFFSET
        ]}
      >
        {/* Debug Pane */}
        {debug && (
          <>
            {/* Visualize the canvas */}
            <mesh scale={[width, height, 1]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial color={colors[debugColorIndex]} wireframe />
            </mesh>
          </>
        )}

        <RectContext.Provider value={{ width, height, debug, debugColorIndex }}>
          {children}
        </RectContext.Provider>
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
