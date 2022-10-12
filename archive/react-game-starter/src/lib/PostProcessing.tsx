/*
Welcome to some truly terrible postprocessing setup code. This should
eventually be replaced with a couple of JSX nodes from react-three/postprocessing.
*/

import { useFrame, useThree } from "@react-three/fiber"
import {
  BlendFunction,
  Effect,
  EffectComposer,
  EffectPass,
  Pass,
  RenderPass,
  SelectiveBloomEffect,
  SMAAEffect,
  VignetteEffect
} from "postprocessing"
import { useLayoutEffect, useMemo } from "react"
import { Camera, HalfFloatType } from "three"

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

const useEffect = (
  composer: EffectComposer,
  camera: Camera,
  factory: () => Effect,
  deps: any[] = []
) => {
  const effect = useMemo(factory, [camera, ...deps])
  usePass(composer, () => new EffectPass(camera, effect), [effect])
}

export const PostProcessing = () => {
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
      luminanceThreshold: 0.9,
      luminanceSmoothing: 0.5,
      intensity: 4
    } as any)

    /*
		This effect is designed to only bloom selected objects. We're not
		interested in that, so let's "invert" it -- making all objects
		selected by default!
		*/
    effect.inverted = true

    return effect
  }, [scene, camera])

  useEffect(composer, camera, () => bloomEffect)
  useEffect(composer, camera, () => new VignetteEffect())
  useEffect(composer, camera, () => new SMAAEffect())

  useFrame(() => {
    composer.render()
  }, 1)

  return null
}
