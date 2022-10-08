import { PerspectiveCamera } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { ScenePass } from "../../lib/ScenePass"

export const HUD = () => {
  return (
    <ScenePass>
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />

      <UIPanel width={4} height={2}>
        <UIPanel width={1} height={1} pivotY={0.5} />
      </UIPanel>
    </ScenePass>
  )
}

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
  return (
    <group {...props}>
      <OriginMarker />

      {/* Apply pivot */}
      <group position={[0.5 - pivotX, 0.5 - pivotY, 0]}>
        {/* Visualize the canvas */}
        <mesh scale={[width, height, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="white" transparent opacity={0.2} />
        </mesh>

        {children}
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
