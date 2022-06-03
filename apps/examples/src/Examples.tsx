import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

export default () => (
  <Canvas>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <mesh>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="red" />
    </mesh>
    <OrbitControls />
  </Canvas>
)
