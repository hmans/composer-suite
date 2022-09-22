import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Perf } from "r3f-perf"
import React, { FC, ReactNode } from "react"
import * as RC from "render-composer"
import { bitmask, Layers } from "render-composer"

export type ThreeApplicationProps = {
  children?: ReactNode

  /* Enable performance monitor by default. */
  performance?: boolean

  /* Enable post-processing effects by default. */
  effects?: boolean

  /* Default DPR. */
  dpr?: number

  /* Enable default lights. */
  lights?: boolean
}

export const ThreeApplication: FC<ThreeApplicationProps> = ({
  children,
  performance = false,
  effects = true,
  dpr = 1,
  lights = true
}) => {
  return (
    <RC.Canvas dpr={controls.dpr}>
      <RC.RenderPipeline>
        {controls.effects && (
          <RC.EffectPass>
            <RC.SMAAEffect />
            <RC.SelectiveBloomEffect />
            <RC.VignetteEffect />
          </RC.EffectPass>
        )}

        {/* Background color */}
        <color args={["#222"]} attach="background" />

        {/* Fog */}
        <fogExp2 args={["#222", 0.03]} attach="fog" />

        {/* Lights */}
        {lights && (
          <>
            <ambientLight
              intensity={0.2}
              layers-mask={bitmask(Layers.Default, Layers.TransparentFX)}
            />
            <directionalLight
              color="white"
              intensity={0.7}
              position={[10, 10, 10]}
              layers-mask={bitmask(Layers.Default, Layers.TransparentFX)}
              castShadow
            />
            <directionalLight
              color="white"
              intensity={0.2}
              position={[-10, 5, 10]}
              layers-mask={bitmask(Layers.Default, Layers.TransparentFX)}
              castShadow
            />
          </>
        )}

        {/* Camera */}
        <PerspectiveCamera position={[0, 2, 8]} makeDefault />

        {/* Camera Controls */}
        <OrbitControls
          makeDefault
          maxDistance={30}
          minDistance={3}
          minPolarAngle={0}
          maxPolarAngle={Math.PI * 0.48}
          autoRotate
          autoRotateSpeed={0}
        />

        {/* Examples */}
        {children}

        {/* Performance Monitor */}
        {controls.performance && <Perf position="bottom-right" />}
      </RC.RenderPipeline>
    </RC.Canvas>
  )
}
