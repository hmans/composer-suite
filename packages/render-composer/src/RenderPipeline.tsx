import { useNullableState } from "@hmans/use-nullable-state"
import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import React, { createContext, useContext } from "react"
import * as RC from "."

const RenderPipelineContext = createContext<{
  depth: THREE.Texture
  scene: THREE.Texture
}>(null!)

export const useRenderPipeline = () => useContext(RenderPipelineContext)

export type RenderPipelineProps = {
  children?: React.ReactNode
}

export const Layers = {
  Default: 0,
  Lights: 30,
  TransparentFX: 31
}

export const RenderPipeline = ({ children }: RenderPipelineProps) => {
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)

  const [depthPass, setDepthPass] = useNullableState<PP.DepthCopyPass>()
  const [scenePass, setScenePass] = useNullableState<PP.CopyPass>()
  const [fxPass, setFxPass] = useNullableState<PP.CopyPass>()

  return (
    <RC.EffectComposer>
      {/* Render all scene objects _except_ for those on the transparent FX layer: */}
      <RC.LayerRenderPass
        camera={camera}
        scene={scene}
        layerMask={camera.layers.mask & ~(1 << Layers.TransparentFX)}
      />

      {/* Steal the render and depth textures for later: */}
      <RC.DepthCopyPass ref={setDepthPass} />
      <RC.CopyPass ref={setScenePass} />

      {/* Render the transparent FX objects on top: */}
      <RC.LayerRenderPass
        camera={camera}
        scene={scene}
        layerMask={(1 << Layers.TransparentFX) | (1 << Layers.Lights)}
        ignoreBackground
      />
      <RC.CopyPass ref={setFxPass} />

      <RC.EffectPass>
        {scenePass && <RC.TextureEffect texture={scenePass.texture} />}
        {fxPass && (
          <RC.TextureEffect
            texture={fxPass.texture}
            blendFunction={PP.BlendFunction.NORMAL}
          />
        )}
      </RC.EffectPass>

      {depthPass && scenePass && (
        <RenderPipelineContext.Provider
          value={{
            depth: depthPass.texture,
            scene: scenePass.texture
          }}
        >
          {children}
        </RenderPipelineContext.Provider>
      )}
    </RC.EffectComposer>
  )
}
