import { useTexture } from "@react-three/drei"
import { RepeatWrapping } from "three"

export const useRepeatingTexture = (url: string) => {
	const texture = useTexture(url)
	texture.wrapS = RepeatWrapping
	texture.wrapT = RepeatWrapping
	return texture
}
