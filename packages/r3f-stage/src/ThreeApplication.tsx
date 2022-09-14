import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useControls } from "leva"
import { Perf } from "r3f-perf"
import React, { FC, ReactNode } from "react"
import {
  Canvas,
  CopyPass,
  DepthCopyPass,
  EffectComposer,
  EffectPass,
  PreRenderPass,
  RenderPass,
  RenderPipeline,
  SelectiveBloomEffect,
  SMAAEffect,
  VignetteEffect
} from "render-composer"
import { Layers } from "./Layers"

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
  /* Let the user control some aspects of the application. */
  const controls = useControls(
    "Presentation Options",
    {
      dpr: { value: dpr, min: 0.125, max: 2 },
      effects,
      performance,
      autoRotate: { value: 0, min: -10, max: 10 }
    },
    { collapsed: true }
  )

  return (
    <Canvas dpr={controls.dpr}>
      <EffectComposer>
        <PreRenderPass />
        <DepthCopyPass />
        <CopyPass />
        <RenderPass />

        {controls.effects && (
          <EffectPass>
            <SMAAEffect />
            <SelectiveBloomEffect />
            <VignetteEffect />
          </EffectPass>
        )}
      </EffectComposer>

      {/* Background color */}
      <color args={["#222"]} attach="background" />

      {/* Fog */}
      <fogExp2 args={["#222", 0.03]} attach="fog" />

      {/* Lights */}
      {lights && (
        <>
          <ambientLight intensity={0.2} />
          <directionalLight
            color="white"
            intensity={0.7}
            position={[10, 10, 10]}
            castShadow
          />
          <directionalLight
            color="white"
            intensity={0.2}
            position={[-10, 5, 10]}
            castShadow
          />
        </>
      )}

      {/* Camera */}
      <PerspectiveCamera
        position={[0, 2, 8]}
        layers-mask={Layers.Default + Layers.TransparentFX}
        makeDefault
      />

      {/* Camera Controls */}
      <OrbitControls
        makeDefault
        maxDistance={30}
        minDistance={3}
        minPolarAngle={0}
        maxPolarAngle={Math.PI * 0.48}
        autoRotate
        autoRotateSpeed={controls.autoRotate}
      />

      {/* Examples */}
      {children}

      {/* Performance Monitor */}
      {controls.performance && <Perf position="bottom-right" />}
    </Canvas>
  )
}
