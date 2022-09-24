import { ECS } from "../state"

export const Debris = () => {
  return (
    <ECS.ManagedEntities tag="isDebris">
      {(entity) => entity.jsx!}
    </ECS.ManagedEntities>
  )
}
