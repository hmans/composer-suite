import { Environment, OrbitControls } from "@react-three/drei"

export const GameplayScene = () => {
  return (
    <>
      <Environment preset="sunset" />
      <mesh>
        <dodecahedronGeometry />
        <meshStandardMaterial color="hotpink" metalness={0.3} roughness={0.4} />
      </mesh>

      <OrbitControls />
    </>
  )
}
