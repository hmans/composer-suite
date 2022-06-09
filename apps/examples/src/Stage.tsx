import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { ReactNode } from "react"
import { FC } from "react"
import { Group } from "three"

export const Stage: FC<{ children?: ReactNode; speed?: number }> = ({
  children,
  speed = 1
}) => {
  const stage = useRef<Group>(null!)

  useFrame((_, dt) => {
    stage.current.rotation.y += speed * dt
  })

  return (
    <group ref={stage}>
      <mesh position-y={-256}>
        <cylinderGeometry args={[16, 16, 512, 64]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      {children}
    </group>
  )
}
