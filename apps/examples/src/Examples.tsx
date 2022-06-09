import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { LinearEncoding } from "three"
import Effects from "./Effects"
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
    <OrbitControls
      autoRotate
      enablePan={false}
      enableZoom={false}
      makeDefault
    />

    {/* Scene objects */}
    <Fog />
    <Effects />
    <Stage />

    <mesh>
      <dodecahedronGeometry />
      <meshStandardMaterial color="#f00" />
    </mesh>

    {/* Rendering, ECS, etc. */}
    <RenderPipeline bloom vignette toneMapping />
    <Perf />
  </Canvas>
)

export default Examples
