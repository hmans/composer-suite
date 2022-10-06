import { AudioLoader, TextureLoader } from "three"
import { GLTFLoader } from "three-stdlib"
import { createLoader } from "@hmans/r3f-create-loader"

/* Use in project, in eg. `assets.ts` */
export const useAsset = {
  asteroid: createLoader(GLTFLoader, "/models/asteroid03.gltf"),
  playerShip: createLoader(GLTFLoader, "/models/ship01.gltf"),
  music: createLoader(AudioLoader, "/sounds/taikobeat.mp3"),
  textures: {
    smoke: createLoader(TextureLoader, "/textures/smoke.png")
  }
}
