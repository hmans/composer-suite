import { useFrame, useThree } from "@react-three/fiber"
import {
  AdaptiveLuminancePass,
  BlendFunction,
  BloomEffect,
  EffectComposer,
  EffectPass,
  Pass,
  RenderPass,
  SelectiveBloomEffect,
  ToneMappingEffect
} from "postprocessing"
import { useEffect, useLayoutEffect, useMemo } from "react"
import { HalfFloatType } from "three"

const usePass = (
  composer: EffectComposer,
  factory: () => Pass,
  deps: any[] = []
) => {
  useLayoutEffect(() => {
    const pass = factory()
    composer.addPass(pass)
    return () => composer.removePass(pass)
  }, [composer, ...deps])
}

export const Rendering = () => {
  const { gl, scene, camera } = useThree()

  const composer = useMemo(
    () => new EffectComposer(gl, { frameBufferType: HalfFloatType }),
    []
  )

  usePass(composer, () => new RenderPass(scene, camera), [scene, camera])

  const bloomEffect = useMemo(() => {
    const effect = new SelectiveBloomEffect(scene, camera, {
      blendFunction: BlendFunction.ADD,
      mipmapBlur: true,
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.1,
      intensity: 4.0
    } as any)
    effect.inverted = true
    return effect
  }, [scene, camera])

  usePass(composer, () => new EffectPass(camera, bloomEffect), [
    bloomEffect,
    camera
  ])

  useFrame(() => {
    composer.render()
  }, 1)

  return null
}
