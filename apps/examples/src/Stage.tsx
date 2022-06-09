import { GroupProps, useFrame } from "@react-three/fiber"
import { FC, useRef } from "react"
import { Group } from "three"

type StageProps = GroupProps & { speed?: number }

export const Stage: FC<StageProps> = ({ children, speed = 1, ...props }) => {
  const stage = useRef<Group>(null!)

  useFrame((_, dt) => {
    stage.current.rotation.y += speed * dt
  })

  return (
    <group ref={stage} {...props}>
      <mesh position-y={-0.5}>
        <cylinderGeometry args={[16, 16, 1, 64]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      <mesh position-y={-1.5 - 2.5}>
        <cylinderGeometry args={[18, 20, 5, 64]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {children}
    </group>
  )
}
