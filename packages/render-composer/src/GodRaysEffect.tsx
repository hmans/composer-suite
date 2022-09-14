import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import { usePostProcessingEffect } from "./lib/usePostProcessingEffect"

export type GodRaysEffectProps = {
  lightSource: ConstructorParameters<typeof PP.GodRaysEffect>[1]
} & ConstructorParameters<typeof PP.GodRaysEffect>[2]

export const GodRaysEffect = ({
  lightSource,
  ...props
}: GodRaysEffectProps) => {
  const camera = useThree((s) => s.camera)
  usePostProcessingEffect(
    () => new PP.GodRaysEffect(camera, lightSource, props),
    { lightSource, ...props }
  )
  return null
}
