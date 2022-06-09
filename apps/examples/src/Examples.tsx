import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { LinearEncoding } from "three"
import { Repeat } from "vfx"
import Effects from "./Effects"
import Explosion from "./effects/Explosion"
import Fog from "./effects/Fog"
import { RenderPipeline } from "./RenderPipeline"
import { Stage } from "./Stage"

const Examples = () => (
  <Canvas
    flat
    gl={{
      logarithmicDepthBuffer: true,
      outputEncoding: LinearEncoding,
      alpha: false,
      depth: true,
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
    <Effects />
    <Stage speed={0}>
      {/* The actual effect */}
      <Repeat times={Infinity} interval={3}>
        <Explosion />
      </Repeat>
    </Stage>

    {/* Rendering, ECS, etc. */}
    <RenderPipeline bloom vignette toneMapping />
    <Perf />
  </Canvas>
)

export default Examples
