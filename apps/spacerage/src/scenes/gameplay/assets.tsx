import { useGLTF } from "@react-three/drei"
import { Loader, useLoader } from "@react-three/fiber"
import { Mesh } from "three"
import { GLTFLoader } from "three-stdlib"

export const useLoadedResource = <L extends new () => Loader<any>>(
  loader: L,
  url: string
) => {
  useLoader.preload(loader, url)
  return () => useLoader(loader, url)
}
