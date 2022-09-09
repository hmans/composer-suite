import {
  Environment,
  OrbitControls,
  PerspectiveCamera
} from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { CuboidCollider, Debug, Physics, RigidBody } from "@react-three/rapier"

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

      <Physics gravity={[0, -5, 0]} colliders={false}>
        <Debug color="red" sleepColor="blue" />

        <RigidBody colliders="hull" restitution={0}>
          <mesh castShadow rotation={[0.2, 0.2, 0.2]}>
            <dodecahedronGeometry />
            <meshStandardMaterial
              color="hotpink"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        </RigidBody>

        <RigidBody type="kinematicPosition">
          <Ground />
          <CuboidCollider position={[0, -0.5, 0]} args={[10, 0.5, 10]} />
        </RigidBody>
      </Physics>

      <fogExp2 args={["#000", 0.03]} attach="fog" />
      <Environment preset="sunset" />

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
