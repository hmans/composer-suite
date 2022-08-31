import { Environment } from "@react-three/drei"

export default function IcosahedronExample() {
  return (
    <>
      <Environment preset="sunset" />
      <mesh castShadow>
        <icosahedronGeometry />
        <meshStandardMaterial metalness={0.3} roughness={0.5} color="#ffb4a2" />
      </mesh>
    </>
  )
}
