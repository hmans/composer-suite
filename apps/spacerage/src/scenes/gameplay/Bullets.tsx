import { ECS } from "./state"

export const Bullets = () => {
  return (
    <ECS.ManagedEntities tag="isBullet">
      {(entity) => entity.jsx!}
    </ECS.ManagedEntities>
  )
}
