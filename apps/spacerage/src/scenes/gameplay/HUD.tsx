import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { createContext, useContext } from "react"
import * as RC from "render-composer"
import { ScenePass } from "../../lib/ScenePass"

export const HUD = () => {
  return (
    <>
      <ScenePass>
        <PerspectiveCamera position={[0, 0, 20]} makeDefault />
        <directionalLight position={[20, 40, 40]} />
        <OrbitControls />
        <UIPanel width={15} height={15} debug>
          <UIPanel
            debug
            width={8}
            height={3}
            anchorY={1}
            pivotY={1}
            position-y={-0.5}
          >
            <Text maxWidth={8} fontSize={0.6} textAlign="center">
              Did I build a world-space UI layout engine? Maybe I did!
            </Text>
          </UIPanel>

          <UIPanel width={3} height={1} anchorY={0} pivotY={0} position-y={0.5}>
            <Button3D />
          </UIPanel>

          <UIPanel
            debug
            width={1}
            height={1}
            position-x={0.1}
            position-y={-0.1}
            {...Anchor.TopLeft}
          />
          <UIPanel
            debug
            width={2}
            height={2}
            position-x={0.1}
            position-y={-0.1}
            {...Anchor.TopLeft}
          />
          <UIPanel
            debug
            width={3}
            height={3}
            position-x={0.1}
            position-y={-0.1}
            {...Anchor.TopLeft}
          />

          <UIPanel
            debug
            width={1}
            height={1}
            position-x={-0.1}
            position-y={0.1}
            {...Anchor.BottomRight}
          />
          <UIPanel
            debug
            width={2}
            height={2}
            position-x={-0.1}
            position-y={0.1}
            {...Anchor.BottomRight}
          />
          <UIPanel
            debug
            width={3}
            height={3}
            position-x={-0.1}
            position-y={0.1}
            {...Anchor.BottomRight}
          />
        </UIPanel>
      </ScenePass>
      <RC.EffectPass>
        <RC.SMAAEffect />
      </RC.EffectPass>
    </>
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
  debug?: boolean
}

export const UIPanel = ({
  anchorX = 0.5,
  anchorY = 0.5,
  pivotX = 0.5,
  pivotY = 0.5,
  width,
  height,
  children,
  debug = false,
  ...props
}: UIPanelProps) => {
  const parent = useContext(PanelContext)

  const offsetX = parent ? parent.width * (anchorX - 0.5) : 0
  const offsetY = parent ? parent.height * (anchorY - 0.5) : 0

  /* This works, but it can probably be written smarter? */
  const fixX = parent ? width / 2 - 1 + pivotX * (2 - width) : 0
  const fixY = parent ? height / 2 - 1 + pivotY * (2 - height) : 0

  return (
    <group {...props}>
      {/* Apply anchor offset */}
      <group position={[offsetX, offsetY, 0.0001]}>
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
            <mesh scale={[width, height, 1]}>
              <planeGeometry />
              <meshBasicMaterial
                color="white"
                transparent
                opacity={0.2}
                // depthWrite={false}
              />
            </mesh>
          )}

          <PanelContext.Provider value={{ width, height }}>
            {children}
          </PanelContext.Provider>
        </group>
      </group>
    </group>
  )
}

const Button3D = () => {
  return (
    <group position-z={0.25}>
      <mesh>
        <boxGeometry args={[4, 1, 0.5]} />
        <meshStandardMaterial color="red" metalness={0.5} roughness={0.5} />
      </mesh>
      <Text maxWidth={8} fontSize={0.6} textAlign="center" position-z={0.25}>
        COOL
      </Text>
    </group>
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
