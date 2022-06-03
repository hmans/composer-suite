import { OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh } from "three"

const Thingy = () => {
  const mesh = useRef<Mesh>(null!)

  useFrame((_, dt) => {
    mesh.current.rotation.x += 0.1 * dt
    mesh.current.rotation.y += 0.2 * dt
  })

  return (
    <mesh ref={mesh} scale={3}>
      <boxBufferGeometry />
      <meshStandardMaterial color="#333" />
    </mesh>
  )
}

export default () => (
  <Canvas>
    <ambientLight intensity={0.2} />
    <pointLight position={[10, 10, 10]} intensity={0.8} />
    <Thingy />
    <OrbitControls />
  </Canvas>
)
