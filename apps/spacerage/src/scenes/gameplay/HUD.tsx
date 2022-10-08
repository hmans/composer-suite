import { PerspectiveCamera } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { createContext, useContext } from "react"
import { ScenePass } from "../../lib/ScenePass"

export const HUD = () => {
  return (
    <ScenePass>
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />

      <UIPanel width={4} height={2} position={[-4, 3, 0]}>
        <UIPanel
          width={1}
          height={1}
          position-x={0.1}
          position-y={-0.1}
          {...Anchor.TopLeft}
        />
      </UIPanel>
    </ScenePass>
  )
}

export const PanelContext = createContext<{ width: number; height: number }>(
  null!
)

export type UIPanelProps = GroupProps & {
  anchorX?: number
  anchorY?: number
  pivotX?: number
  pivotY?: number
  width: number
  height: number
}

export const UIPanel = ({
  anchorX = 0.5,
  anchorY = 0.5,
  pivotX = 0.5,
  pivotY = 0.5,
  width,
  height,
  children,
  ...props
}: UIPanelProps) => {
  const parent = useContext(PanelContext)

  const offsetX = parent ? parent.width * (anchorX - 0.5) : 0
  const offsetY = parent ? parent.height * (anchorY - 0.5) : 0

  return (
    <group {...props}>
      {/* Apply anchor offset */}
      <group position={[offsetX, offsetY, 0]}>
        <OriginMarker />

        {/* Apply pivot */}
        <group position={[0.5 - pivotX, 0.5 - pivotY, 0]}>
          {/* Visualize the canvas */}
          <mesh scale={[width, height, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="white" transparent opacity={0.2} />
          </mesh>

          <PanelContext.Provider value={{ width, height }}>
            {children}
          </PanelContext.Provider>
        </group>
      </group>
    </group>
  )
}

const OriginMarker = () => (
  <mesh>
    <sphereGeometry args={[0.05]} />
    <meshBasicMaterial color="red" />
  </mesh>
)

const Anchor = {
  TopLeft: {
    anchorX: 0,
    pivotX: 0,
    anchorY: 1,
    pivotY: 1
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
