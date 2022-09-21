import { useGLTF } from "@react-three/drei"

export const Player = () => {
  const gltf = useGLTF("/models/spaceship25.gltf")

  return (
    <group>
      <primitive object={gltf.scene} scale={0.1} />
    </group>
  )
}
