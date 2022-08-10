import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useControls } from "leva"
import React, { FC, ReactNode } from "react"
import { LinearEncoding } from "three"
import { PostProcessing } from "./PostProcessing"
import { Stage } from "./Stage"
import { Perf } from "r3f-perf"
import { Layers } from "./Layers"

export const R3FCanvas: FC<{ children: ReactNode; perf?: boolean }> = ({
  children,
  perf = false
}) => {
  const { halfResolution, postProcessing, autoRotate } = useControls(
    "Presentation",
    {
      halfResolution: false,
      postProcessing: true,
      autoRotate: { value: 0, min: -20, max: 20 }
    }
  )

  return (
    <Canvas
      flat
      gl={{
        outputEncoding: LinearEncoding,
        powerPreference: "high-performance",
        alpha: false,
        depth: true,
        stencil: false
      }}
      dpr={halfResolution ? [0.5, 0.5] : [1, 1]}
      shadows
    >
      {/* Lights, fog, camera, etc. */}
      <color attach="background" args={["#987"]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-radius={10}
        shadow-bias={-0.0001}
      />
      <fog attach="fog" args={["#987", 50, 300]} />
      <PerspectiveCamera
        position={[0, 10, 50]}
        layers-mask={Layers.Default + Layers.TransparentFX}
        makeDefault
      />

      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        makeDefault
        autoRotate={autoRotate !== 0}
        autoRotateSpeed={autoRotate}
      />

      {/* Scene objects */}
      <Stage>{children}</Stage>

      {/* Rendering, ECS, etc. */}
      {postProcessing && <PostProcessing />}
      {perf && <Perf position="bottom-right" deepAnalyze />}
    </Canvas>
  )
}
