import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { LinearEncoding } from "three"
import Effects from "./Effects"
import Fog from "./effects/Fog"
import { RenderPipeline } from "./RenderPipeline"

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
    <fogExp2 attach="fog" args={["#000", 0.005]} />
    <PerspectiveCamera position={[0, 5, 50]} makeDefault />
    <OrbitControls
      autoRotate
      // enablePan={false}
      // enableRotate={false}
      // enableZoom={false}
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

const Stage = () => (
  <group>
    <mesh position-y={-64}>
      <cylinderGeometry args={[16, 16, 128, 64]} />
      <meshStandardMaterial color="#888" />
    </mesh>
  </group>
)

export default Examples
