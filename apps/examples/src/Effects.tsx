import { FC } from "react"
import ECS from "./ECS"
import SimpleSmoke from "./effects/SimpleSmoke"

const Effect: FC = () => {
  const { spawn } = ECS.useEntity()

  return <SimpleSmoke {...spawn} />
}

export default () => (
  <ECS.ManagedEntities tag="isEffect">
    <Effect />
  </ECS.ManagedEntities>
)
