import { PerspectiveCamera, Text } from "@react-three/drei"
import { GroupProps, MeshProps } from "@react-three/fiber"
import { Color } from "three"
import { ScenePass } from "../../lib/ScenePass"

export const HUD = () => {
  return (
    <ScenePass>
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />

      <UICanvas width={4} height={3} x={0} y={0}>
        <UICanvas
          width={1}
          height={1}
          x={0}
          y={0}
          position-x={0.2}
          position-y={-0.2}
        >
          {/* <Text color="black" fontSize={1} anchorX={0} anchorY={0}>
            723.389.150
          </Text> */}
        </UICanvas>
      </UICanvas>
    </ScenePass>
  )
}

export type UICanvasProps = GroupProps & {
  x: number
  y: number
  width: number
  height: number
}

export const UICanvas = ({
  x,
  y,
  width,
  height,
  children,
  ...props
}: UICanvasProps) => {
  return (
    <group {...props}>
      <OriginMarker />

      {/* Visualize the canvas */}
      <mesh position={[width / 2, -height / 2, 0]} scale={[width, height, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="white" transparent opacity={0.2} />
      </mesh>

      {children}
    </group>
  )
}

const OriginMarker = () => (
  <mesh>
    <sphereGeometry args={[0.05]} />
    <meshBasicMaterial color="red" />
  </mesh>
)
