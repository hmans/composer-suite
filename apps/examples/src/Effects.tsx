import { FC } from "react"
import ECS from "./ECS"

const Effect: FC = () => {
  const { spawn } = ECS.useEntity()

  return (
    <mesh {...spawn} scale={0.2}>
      <sphereGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default () => (
  <ECS.ManagedEntities tag="isEffect">
    <Effect />
  </ECS.ManagedEntities>
)
