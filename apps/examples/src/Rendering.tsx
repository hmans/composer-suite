import { useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, RenderPass } from "postprocessing"
import { useEffect, useLayoutEffect, useMemo } from "react"

const usePass = (
  composer: EffectComposer,
  factory: () => RenderPass,
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

  const composer = useMemo(() => new EffectComposer(gl), [])

  usePass(composer, () => new RenderPass(scene, camera), [scene, camera])

  useFrame(() => {
    composer.render()
  }, 1)

  return null
}
