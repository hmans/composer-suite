import { createLoader } from "@hmans/r3f-create-loader"
import { TextureLoader } from "three"

/* Use in project, in eg. `assets.ts` */
export const useAsset = {
  textures: {
    lensdirt: createLoader(TextureLoader, "/textures/lensdirt.jpg")
  }
}
