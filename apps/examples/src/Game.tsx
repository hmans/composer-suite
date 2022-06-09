import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { LinearEncoding } from "three"
import { Repeat } from "vfx"
import { Route, useRoute } from "wouter"
import examples, { ExampleDefinition } from "./examples"
import { RenderPipeline } from "./RenderPipeline"
import { Stage } from "./Stage"
import { useControls } from "leva"
import { FC } from "react"
export const Game = () => (
  <Canvas
    flat
    gl={{
      logarithmicDepthBuffer: true,
      outputEncoding: LinearEncoding,
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false
    }}
  >
    {/* Lights, fog, camera, etc. */}
    <ambientLight intensity={0.4} />
    <directionalLight position={[10, 10, 10]} intensity={1} />
    <fog attach="fog" args={["#000", 20, 180]} />
    <PerspectiveCamera position={[0, 20, 50]} makeDefault />
    <OrbitControls enablePan={false} enableZoom={false} makeDefault />

    {/* Scene objects */}
    <Stage speed={0}>
      <Route path="/:path">
        <ExampleMatcher />
      </Route>
    </Stage>

    {/* Rendering, ECS, etc. */}
    <RenderPipeline bloom vignette toneMapping />
    <Perf position="bottom-right" />
  </Canvas>
)

const ExampleMatcher = () => {
  const [match, params] = useRoute("/:path")
  const example = match && (examples.find((e) => e.path == params!.path) as any)

  return example?.component && <Example example={example} />
}

const Example: FC<{ example: ExampleDefinition }> = ({ example }) => {
  const { loop, interval } = useControls({
    loop: false,
    interval: { value: 3, min: 0, max: 10 }
  })

  return (
    <Repeat times={loop ? Infinity : 0} interval={interval}>
      {example.component}
    </Repeat>
  )
}
