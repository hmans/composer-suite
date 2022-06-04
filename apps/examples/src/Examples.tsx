import { OrbitControls, PerspectiveCamera, Plane } from "@react-three/drei"
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber"
import { Tag } from "miniplex"
import { useCallback, useRef } from "react"
import { Mesh, Object3D, Vector3 } from "three"
import ECS from "./ECS"
import Effects from "./Effects"

const spawnEffect = (position: Vector3) => {
  ECS.world.createEntity({ isEffect: Tag, spawn: { position } })
}

const Thingy = () => {
  const mesh = useRef<Mesh>(null!)

  useFrame((_, dt) => {
    mesh.current.rotation.x += 0.1 * dt
    mesh.current.rotation.y += 0.2 * dt
  })

  return (
    <mesh ref={mesh} scale={3} onClick={(e) => spawnEffect(e.point)}>
      <boxBufferGeometry />
      <meshStandardMaterial color="#555" />
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
      <meshStandardMaterial color="#333" />
    </Plane>
  )
}

export default () => (
  <Canvas>
    <ambientLight intensity={0.2} />
    <pointLight position={[10, 10, 10]} intensity={0.8} />
    <Ground />
    <Thingy />
    <Effects />
    <OrbitControls />
    <fog attach="fog" args={["#000", 32, 256]} />
    <PerspectiveCamera position={[0, 5, 20]} makeDefault />
  </Canvas>
)
