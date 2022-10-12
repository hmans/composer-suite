import * as RC from "render-composer"
import { makeStore } from "statery"
import { Mesh } from "three"
import { useAsset } from "../../assets"

export const store = makeStore({
  sun: null as Mesh | null
})

export const PostProcessing = () => {
  const texture = useAsset.textures.lensdirt()

  return (
    <RC.EffectPass>
      <RC.SMAAEffect />
      <RC.SelectiveBloomEffect intensity={4} luminanceThreshold={1} />
      <RC.LensDirtEffect texture={texture} />
      <RC.VignetteEffect />
    </RC.EffectPass>
  )
}
