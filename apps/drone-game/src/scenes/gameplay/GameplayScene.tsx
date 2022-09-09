import { Animate, rotate } from "@hmans/things"
import {
  Environment,
  OrbitControls,
  PerspectiveCamera
} from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"

export const GameplayScene = () => {
  return (
    <>
      <Environment preset="sunset" />

      <Ground />

      <Animate fun={rotate(1, 1.5, -0.4)} position-y={1.5}>
        <mesh>
          <dodecahedronGeometry />
          <meshStandardMaterial
            color="hotpink"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </Animate>

      <PerspectiveCamera position={[0, 3, 7]} makeDefault />

      <OrbitControls />
    </>
  )
}

const Ground = (props: GroupProps) => (
  <group {...props}>
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  </group>
)
