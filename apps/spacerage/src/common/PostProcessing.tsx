import { useTexture } from "@react-three/drei"
import * as RC from "render-composer"
import { makeStore, useStore } from "statery"
import { Mesh } from "three"

export const store = makeStore({
  sun: null as Mesh | null
})

export const PostProcessing = () => {
  const { sun } = useStore(store)
  const texture = useTexture("/textures/lensdirt.jpg")

  return (
    <RC.EffectPass>
      <RC.SMAAEffect />
      <RC.SelectiveBloomEffect intensity={4} luminanceThreshold={1} />
      {sun && <RC.GodRaysEffect lightSource={sun} />}
      <RC.LensDirtEffect texture={texture} />
      <RC.VignetteEffect />
    </RC.EffectPass>
  )
}
