import { GLTFAsset } from "../../common/GLTFAsset"

export const Asteroid = () => {
  return (
    <group>
      <mesh>
        <boxGeometry />
        <meshBasicMaterial />
      </mesh>
      <GLTFAsset url="/models/asteroid03.gltf" />
    </group>
  )
}
