import { OrbitControls } from "@react-three/drei"
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber"
import { Tag } from "miniplex"
import { useCallback, useRef } from "react"
import { Mesh, Object3D } from "three"
import ECS from "./ECS"
import Effects from "./Effects"

const Thingy = () => {
  const mesh = useRef<Mesh>(null!)

  useFrame((_, dt) => {
    mesh.current.rotation.x += 0.1 * dt
    mesh.current.rotation.y += 0.2 * dt
  })

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    ECS.world.createEntity({ isEffect: Tag, spawn: { position: e.point } })
  }, [])

  return (
    <mesh ref={mesh} scale={3} onClick={handleClick}>
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
    <Effects />
    <OrbitControls />
  </Canvas>
)
