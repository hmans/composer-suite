import { FC } from "react"
import ECS from "./ECS"
import Explosion from "./effects/Explosion"

const Effect: FC = () => {
  const { spawn } = ECS.useEntity()

  return <Explosion {...spawn} />
}

export default () => (
  <ECS.ManagedEntities tag="isEffect">
    <Effect />
  </ECS.ManagedEntities>
)
