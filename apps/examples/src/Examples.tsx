import { OrbitControls, PerspectiveCamera, Plane } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { useRef } from "react"
import { LinearEncoding, Mesh } from "three"
import spawnEffect from "./actions/spawnEffect"
import Effects from "./Effects"
import Fog from "./effects/Fog"
import { RenderPipeline } from "./RenderPipeline"
import ageSystem from "./systems/ageSystem"
import flushQueueSystem from "./systems/flushQueueSystem"
import maxAgeSystem from "./systems/maxAgeSystem"

const Ground = () => {
  return (
    <Plane
      args={[1000, 1000]}
      rotation-x={-Math.PI / 2}
      onClick={(e) => spawnEffect(e.point)}
    >
      <meshStandardMaterial color="#888" />
    </Plane>
  )
}

const Systems = () => {
  useFrame((_, dt) => {
    ageSystem(dt)
    maxAgeSystem()
    flushQueueSystem()
  })

  return null
}

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
    <PerspectiveCamera position={[0, 30, 100]} makeDefault />
    <OrbitControls
      autoRotate
      enablePan={false}
      enableRotate={false}
      enableZoom={false}
    />

    {/* Scene objects */}
    <Ground />
    <Fog />
    <Effects />

    {/* Rendering, ECS, etc. */}
    <RenderPipeline bloom vignette toneMapping />
    <Systems />
    <Perf />
  </Canvas>
)

export default Examples
