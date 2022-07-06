import { GroupProps } from "@react-three/fiber"
import { FC } from "react"

type StageProps = GroupProps

export const Stage: FC<StageProps> = ({ children, ...props }) => {
  return (
    <group {...props}>
      <group position-y={-8}>
        {/* Floor */}
        <mesh position-y={-5} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial color="#555" />
        </mesh>

        {/* Upper pedestral */}
        <mesh position-y={-0} receiveShadow>
          <cylinderGeometry args={[16, 16, 1, 64]} />
          <meshStandardMaterial color="#eee" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Lower pedestral */}
        <mesh position-y={-3.5} receiveShadow>
          <cylinderGeometry args={[18, 20, 5, 64]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.4} />
        </mesh>

        {children}
      </group>
    </group>
  )
}
