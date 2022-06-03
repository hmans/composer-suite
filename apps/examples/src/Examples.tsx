import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

export default () => (
  <Canvas>
    <ambientLight intensity={0.2} />
    <pointLight position={[10, 10, 10]} intensity={0.8} />
    <mesh scale={3}>
      <boxBufferGeometry />
      <meshStandardMaterial color="#333" />
    </mesh>
    <OrbitControls />
  </Canvas>
)
