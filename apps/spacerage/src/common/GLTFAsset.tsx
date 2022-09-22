import { useGLTF } from "@react-three/drei"

export const GLTFAsset = ({ url }: { url: string }) => {
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene.clone()} />
}
