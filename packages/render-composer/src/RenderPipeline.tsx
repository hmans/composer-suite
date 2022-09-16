import { useNullableState } from "@hmans/use-nullable-state"
import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import React, { createContext, useContext } from "react"
import * as RC from "."
import { bitmask } from "./lib/bitmask"

const RenderPipelineContext = createContext<{
  depth: THREE.Texture
  color: THREE.Texture
}>(null!)

export const useRenderPipeline = () => useContext(RenderPipelineContext)

export type RenderPipelineProps = {
  children?: React.ReactNode
}

export const Layers = {
  Default: 0,
  TransparentFX: 31
}

export const RenderPipeline = ({ children }: RenderPipelineProps) => {
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)

  const [depthPass, setDepthPass] = useNullableState<PP.DepthCopyPass>()
  const [colorPass, setColorPass] = useNullableState<PP.CopyPass>()

  return (
    <RC.EffectComposer>
      {/* Render all scene objects _except_ for those on the transparent FX layer: */}
      <RC.LayerRenderPass
        camera={camera}
        scene={scene}
        clear
        layerMask={camera.layers.mask & bitmask.not(Layers.TransparentFX)}
      />

      {/* Steal the render and depth textures for later: */}
      <RC.DepthCopyPass ref={setDepthPass} />
      <RC.CopyPass ref={setColorPass} />

      {/* Render the transparent FX objects on top: */}
      <RC.LayerRenderPass
        camera={camera}
        scene={scene}
        layerMask={bitmask(Layers.TransparentFX)}
        ignoreBackground
      />

      {depthPass && colorPass && (
        <RenderPipelineContext.Provider
          value={{
            depth: depthPass.texture,
            color: colorPass.texture
          }}
        >
          {children}
        </RenderPipelineContext.Provider>
      )}
    </RC.EffectComposer>
  )
}
