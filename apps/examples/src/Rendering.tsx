import { useFrame, useThree } from "@react-three/fiber"
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  Pass,
  RenderPass
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
  usePass(
    composer,
    () => new EffectPass(camera, new BloomEffect({ intensity: 1 })),
    [camera]
  )

  useFrame(() => {
    composer.render()
  }, 1)

  return null
}
