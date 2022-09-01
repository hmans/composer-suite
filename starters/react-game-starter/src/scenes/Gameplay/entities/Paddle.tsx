import { ColorRepresentation } from "three"
import { paddleHeight, paddleWidth } from "../configuration"

export type PaddleProps = {
  color: ColorRepresentation
}

export const Paddle = ({ color }: PaddleProps) => (
  <group>
    <mesh>
      <boxGeometry args={[paddleWidth, paddleHeight, paddleWidth]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.1} />
    </mesh>
  </group>
)
