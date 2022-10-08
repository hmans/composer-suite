import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { createContext, useContext } from "react"
import { ScenePass } from "../../lib/ScenePass"

export const HUD = () => {
  return (
    <ScenePass>
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />
      <directionalLight position={[20, 40, 40]} />
      <OrbitControls />
      <UIPanel width={10} height={6}>
        <Button3D />
        <UIPanel
          width={1}
          height={1}
          position-x={0.1}
          position-y={-0.1}
          {...Anchor.TopLeft}
        />
        <UIPanel
          width={2}
          height={2}
          position-x={0.1}
          position-y={-0.1}
          {...Anchor.TopLeft}
        />
        <UIPanel
          width={3}
          height={3}
          position-x={0.1}
          position-y={-0.1}
          {...Anchor.TopLeft}
        />

        <UIPanel
          width={1}
          height={1}
          position-x={-0.1}
          position-y={0.1}
          {...Anchor.BottomRight}
        />
        <UIPanel
          width={2}
          height={2}
          position-x={-0.1}
          position-y={0.1}
          {...Anchor.BottomRight}
        />
        <UIPanel
          width={3}
          height={3}
          position-x={-0.1}
          position-y={0.1}
          {...Anchor.BottomRight}
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

  const fixX = parent ? width / 2 - 1 + pivotX * (2 - width) : 0
  const fixY = parent ? height / 2 - 1 + pivotY * (2 - height) : 0

  return (
    <group {...props}>
      {/* Apply anchor offset */}
      <group position={[offsetX, offsetY, 0.0001]}>
        <OriginMarker />

        {/* Apply pivot */}
        <group position={[1 - anchorX - pivotX, 1 - anchorY - pivotY, 0]}>
          {/* Apply hack */}
          <group position={[fixX, fixY, 0]}>
            {/* Visualize the canvas */}
            <mesh scale={[width, height, 1]}>
              <planeGeometry />
              <meshBasicMaterial
                color="white"
                transparent
                opacity={0.2}
                depthWrite={false}
              />
            </mesh>

            <PanelContext.Provider value={{ width, height }}>
              {children}
            </PanelContext.Provider>
          </group>
        </group>
      </group>
    </group>
  )
}

const Button3D = () => {
  return (
    <mesh>
      <boxGeometry args={[3, 1, 0.5]} />
      <meshStandardMaterial
        color="red"
        metalness={0.5}
        roughness={0.5}
        depthWrite={false}
      />
    </mesh>
  )
}

const OriginMarker = () => (
  <mesh>
    <sphereGeometry args={[0.1]} />
    <meshBasicMaterial color="red" depthTest={false} />
  </mesh>
)

const Anchor = {
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
