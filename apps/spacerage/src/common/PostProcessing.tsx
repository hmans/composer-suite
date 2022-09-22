import * as RC from "render-composer"
import { makeStore, useStore } from "statery"
import { Mesh } from "three"

export const store = makeStore({
  sun: null as Mesh | null
})

export const PostProcessing = () => {
  const { sun } = useStore(store)
  return (
    <RC.EffectPass>
      <RC.SMAAEffect />
      <RC.SelectiveBloomEffect intensity={4} luminanceThreshold={0.5} />
      {sun && <RC.GodRaysEffect lightSource={sun} />}
      <RC.VignetteEffect />
    </RC.EffectPass>
  )
}
