import { GroupProps } from "@react-three/fiber"
import React, { createContext, useContext } from "react"
import { DoubleSide } from "three"

export const RectContext = createContext<{
  width: number
  height: number
  debug: boolean
}>(null!)

export type RectProps = GroupProps & {
  anchorX?: number
  anchorY?: number
  pivotX?: number
  pivotY?: number
  width: number
  height: number
  debug?: boolean
}

export const Rect = ({
  anchorX = 0.5,
  anchorY = 0.5,
  pivotX = 0.5,
  pivotY = 0.5,
  width,
  height,
  children,
  debug: _debug,
  ...props
}: RectProps) => {
  const parent = useContext(RectContext)

  const debug = _debug ?? parent?.debug ?? false

  const offsetX = parent ? parent.width * (anchorX - 0.5) : 0
  const offsetY = parent ? parent.height * (anchorY - 0.5) : 0

  /* This works, but it can probably be written smarter? */
  const fixX = parent ? width / 2 - 1 + pivotX * (2 - width) : 0
  const fixY = parent ? height / 2 - 1 + pivotY * (2 - height) : 0

  return (
    <group {...props}>
      {/* Apply anchor offset */}
      <group position={[offsetX, offsetY, 0]}>
        {debug && <OriginMarker />}

        {/* Apply pivot */}
        <group
          position={[
            fixX + 1 - anchorX - pivotX,
            fixY + 1 - anchorY - pivotY,
            0
          ]}
        >
          {/* Visualize the canvas */}
          {debug && (
            <mesh>
              <planeGeometry args={[width, height]} />
              <meshBasicMaterial color="cyan" wireframe />
            </mesh>
          )}

          <RectContext.Provider value={{ width, height, debug }}>
            <group position-z={+0.3}>{children}</group>
          </RectContext.Provider>
        </group>
      </group>
    </group>
  )
}

const OriginMarker = () => (
  <mesh>
    <sphereGeometry args={[0.1]} />
    <meshBasicMaterial color="red" depthTest={false} />
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
