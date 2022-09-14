import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import { useContext, useMemo } from "react"
import { EffectPassContext } from "./EffectPass"

export const SMAAEffect = () => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const effects = useContext(EffectPassContext)

  const effect = useMemo(() => new PP.SMAAEffect(), [])

  effects.useItem(effect)

  return null
}
