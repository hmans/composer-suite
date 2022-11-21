import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import * as UI from "@hmans/scene-ui"

export const HUD = () => {
  const camera = useThree((state) => state.camera)

  return (
    <>
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />
      <directionalLight position={[20, 40, 40]} />
      <OrbitControls />

      {camera && (
        <UI.Rect width={15} height={15} position={[1, 0, 1]} debug>
          <UI.Rect
            width={8}
            height={3}
            anchorY={1}
            pivotY={1}
            position-y={-0.5}
          >
            <Text maxWidth={8} fontSize={0.6} textAlign="center">
              Did I build a world-space UI layout engine? Maybe I did!
            </Text>
          </UI.Rect>

          <UI.Rect width={3} height={1} anchorY={0} pivotY={0} position-y={0.5}>
            <UI.Button3D
              label="Click Me"
              onClick={(e) => {
                e.stopPropagation()
                alert("You CLICKED me!")
              }}
            />
          </UI.Rect>

          <UI.Rect
            width={1}
            height={1}
            position-x={0.1}
            position-y={-0.1}
            {...UI.Anchor.TopLeft}
          />
          <UI.Rect
            width={2}
            height={2}
            position-x={0.1}
            position-y={-0.1}
            {...UI.Anchor.TopLeft}
          />
          <UI.Rect
            width={3}
            height={3}
            position-x={0.1}
            position-y={-0.1}
            {...UI.Anchor.TopLeft}
          />

          <UI.Rect
            width={1}
            height={1}
            position-x={-0.1}
            position-y={0.1}
            {...UI.Anchor.BottomRight}
          />
          <UI.Rect
            width={2}
            height={2}
            position-x={-0.1}
            position-y={0.1}
            {...UI.Anchor.BottomRight}
          />
          <UI.Rect
            width={3}
            height={3}
            position-x={-0.1}
            position-y={0.1}
            {...UI.Anchor.BottomRight}
          />
        </UI.Rect>
      )}
    </>
  )
}
