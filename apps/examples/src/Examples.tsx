import { OrbitControls, PerspectiveCamera, Plane } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { useRef } from "react"
import { LinearEncoding, Mesh } from "three"
import spawnEffect from "./actions/spawnEffect"
import Effects from "./Effects"
import Smoke from "./effects/Smoke"
import { RenderPipeline } from "./RenderPipeline"
import ageSystem from "./systems/ageSystem"
import flushQueueSystem from "./systems/flushQueueSystem"
import maxAgeSystem from "./systems/maxAgeSystem"

const RotatingCube = () => {
  const mesh = useRef<Mesh>(null!)

  useFrame((_, dt) => {
    mesh.current.rotation.x += 0.1 * dt
    mesh.current.rotation.y += 0.2 * dt
  })

  return (
    <mesh ref={mesh} scale={8} onClick={(e) => spawnEffect(e.point)}>
      <dodecahedronGeometry />
      <meshStandardMaterial
        color="cyan"
        emissiveIntensity={1}
        emissive="cyan"
      />
    </mesh>
  )
}

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

export default () => (
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
    <ambientLight intensity={0.4} />
    <directionalLight position={[10, 10, 10]} intensity={1} />
    <fogExp2 attach="fog" args={["#000", 0.005]} />

    <PerspectiveCamera position={[0, 30, 100]} makeDefault />

    <Ground />
    <RotatingCube />
    <Smoke />
    <Effects />
    <OrbitControls />

    <RenderPipeline />
    <Systems />
    <Perf />
  </Canvas>
)
