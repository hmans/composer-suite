import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useThree } from "@react-three/fiber"

export const HUD = () => {
  const camera = useThree((state) => state.camera)

  return (
    <>
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />
      <directionalLight position={[20, 40, 40]} />
      <OrbitControls />

      {/* {camera && (
      )} */}
    </>
  )
}
