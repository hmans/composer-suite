import { useFrame, useThree } from "@react-three/fiber"
import {
  CopyPass,
  DepthCopyPass,
  EffectComposer,
  RenderPass
} from "postprocessing"
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useLayoutEffect,
  useMemo
} from "react"
import * as THREE from "three"
import { BasicDepthPacking } from "three"
import { LayerRenderPass } from "./LayerRenderPass"

export const Layers = {
  Default: 0,
  TransparentFX: 1
}

const RenderPipelineContext = createContext<{
  depth: THREE.Texture
  scene: THREE.Texture
}>(null!)

export const useRenderPipeline = () => useContext(RenderPipelineContext)

export type RenderPipelineProps = {
  children?: ReactNode
  updatePriority?: number
}

export const RenderPipeline: FC<RenderPipelineProps> = ({
  children,
  updatePriority = 1
}) => {
  const { gl, scene, camera, size } = useThree()

  /* Create all the basic primitives we will be using. */
  const { composer, passes } = useMemo(() => {
    const composer = new EffectComposer(gl, {
      frameBufferType: THREE.HalfFloatType
    })

    const passes = {
      preRenderPass: new LayerRenderPass(
        scene,
        camera,
        undefined,
        camera.layers.mask & ~(1 << Layers.TransparentFX)
      ),

      copyPass: new CopyPass(),

      depthCopyPass: new DepthCopyPass({ depthPacking: BasicDepthPacking }),

      fullScenePass: new RenderPass(scene, camera)
    }

    composer.addPass(passes.preRenderPass)
    composer.addPass(passes.depthCopyPass)
    composer.addPass(passes.copyPass)
    composer.addPass(passes.fullScenePass)

    return {
      composer,
      passes
    }
  }, [camera, scene])

  useLayoutEffect(() => {
    return () => composer.removeAllPasses()
  }, [composer])

  /* Apply updated sizes and resolutions when they change. */
  useLayoutEffect(() => {
    composer.setSize(size.width, size.height)
  }, [size.width, size.height, composer])

  /* Render the scene! */
  useFrame(() => {
    composer.render()
  }, updatePriority)

  return (
    <RenderPipelineContext.Provider
      value={{
        depth: passes.depthCopyPass.texture,
        scene: passes.copyPass.texture
      }}
    >
      {children}
    </RenderPipelineContext.Provider>
  )
}
