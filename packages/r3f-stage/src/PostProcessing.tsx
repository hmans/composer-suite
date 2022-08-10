import { useFrame, useThree } from "@react-three/fiber"
import {
  BlendFunction,
  EffectComposer,
  EffectPass,
  Pass,
  RenderPass,
  SelectiveBloomEffect
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

export const PostProcessing = () => {
  const { gl, scene, camera, size } = useThree()

  const composer = useMemo(
    () => new EffectComposer(gl, { frameBufferType: HalfFloatType }),
    []
  )

  usePass(composer, () => new RenderPass(scene, camera), [scene, camera])

  const bloomEffect = useMemo(() => {
    const effect = new SelectiveBloomEffect(scene, camera, {
      blendFunction: BlendFunction.ADD,
      mipmapBlur: true,
      luminanceThreshold: 0.7,
      luminanceSmoothing: 0.3,
      intensity: 4
    } as any)
    effect.inverted = true
    return effect
  }, [scene, camera])

  usePass(composer, () => new EffectPass(camera, bloomEffect), [
    bloomEffect,
    camera
  ])

  useEffect(() => {
    composer.setSize(size.width, size.height)
  }, [composer, size.width, size.height])

  useFrame(() => {
    composer.render()
  }, 1)

  return null
}
