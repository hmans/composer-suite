import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"

export const GameplayScene = () => {
  return (
    <>
      <>
        <ambientLight intensity={0.2} />
        <directionalLight
          color="white"
          intensity={0.7}
          position={[10, 10, 10]}
          castShadow
        />
        <directionalLight
          color="white"
          intensity={0.2}
          position={[-10, 5, 10]}
          castShadow
        />
      </>

      <fogExp2 args={["#000", 0.03]} attach="fog" />
      {/* <Environment preset="sunset" /> */}

      <Ground />

      <mesh castShadow>
        <dodecahedronGeometry />
        <meshStandardMaterial color="hotpink" metalness={0.3} roughness={0.4} />
      </mesh>

      <PerspectiveCamera position={[0, 3, 7]} makeDefault />

      <OrbitControls />
    </>
  )
}

const Ground = (props: GroupProps) => (
  <group {...props}>
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  </group>
)
