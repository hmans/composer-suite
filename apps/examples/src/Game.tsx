import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { button, useControls } from "leva"
import { Perf } from "r3f-perf"
import { FC, ReactNode, Suspense, useState } from "react"
import { LinearEncoding } from "three"
import { Repeat } from "three-vfx"
import { Route, useRoute } from "wouter"
import examples, { ExampleDefinition } from "./examples"
import { PostProcessing } from "./PostProcessing"
import { Stage } from "./Stage"

const SandboxStage: FC<{ children: ReactNode }> = ({ children }) => {
  const { halfResolution, postProcessing } = useControls("Rendering", {
    halfResolution: false,
    postProcessing: true
  })

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
      <PerspectiveCamera position={[0, 10, 50]} makeDefault />

      <OrbitControls maxPolarAngle={Math.PI / 2} makeDefault />

      {/* Scene objects */}
      <Stage>{children}</Stage>

      {/* Rendering, ECS, etc. */}
      {postProcessing && <PostProcessing />}
      <Perf position="bottom-right" deepAnalyze />
    </Canvas>
  )
}

export const Game = () => (
  <SandboxStage>
    <Route path="/:path">
      <Suspense>
        <ExampleMatcher />
      </Suspense>
    </Route>
  </SandboxStage>
)

const ExampleMatcher = () => {
  const [match, params] = useRoute("/:path")
  const example = match && (examples.find((e) => e.path == params!.path) as any)

  return example?.component && <Example example={example} />
}

const Example: FC<{ example: ExampleDefinition }> = ({ example }) => {
  const [v, setV] = useState(Math.random())

  const { loop, interval } = useControls("Controls", {
    restart: button(() => setV(Math.random())),
    loop: false,
    interval: { value: 1, min: 0, max: 10 }
  })

  return (
    <Repeat key={v} times={loop ? Infinity : 0} interval={interval}>
      {example.component}
    </Repeat>
  )
}
