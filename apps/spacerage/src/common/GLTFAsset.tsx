import { useGLTF } from "@react-three/drei"
import { Mesh } from "three"

export const GLTFAsset = ({ url }: { url: string }) => {
  const gltf = useGLTF(url)
  const mesh = (gltf.scene.children[0] as Mesh).clone()
  return <mesh geometry={mesh.geometry} material={mesh.material} />
}
