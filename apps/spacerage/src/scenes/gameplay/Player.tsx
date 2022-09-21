import { useGLTF } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

export const Player = () => {
  const gltf = useGLTF("/models/spaceship25.gltf")

  return (
    <RigidBody>
      <primitive object={gltf.scene} scale={0.1} />
    </RigidBody>
  )
}
